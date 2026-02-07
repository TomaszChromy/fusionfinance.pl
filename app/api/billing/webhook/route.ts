import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const stripe = env.stripeSecretKey
  ? new Stripe(env.stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null;

async function upsertSubscription(payload: {
  userId: string;
  plan: string;
  customerId?: string | null;
  subscriptionId?: string | null;
  currentPeriodEnd?: number | null;
}) {
  const { userId, plan, customerId, subscriptionId, currentPeriodEnd } = payload;
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      stripeCustomerId: customerId ?? undefined,
      stripeSubscriptionId: subscriptionId ?? undefined,
      currentPeriodEnd: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000)
        : undefined,
      status: "active",
    },
    create: {
      userId,
      plan,
      stripeCustomerId: customerId ?? undefined,
      stripeSubscriptionId: subscriptionId ?? undefined,
      currentPeriodEnd: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000)
        : undefined,
      status: "active",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!stripe || !env.stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.stripeWebhookSecret
    );
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId ?? "pro";
        if (userId) {
          await upsertSubscription({
            userId,
            plan: planId,
            customerId: session.customer?.toString(),
            subscriptionId: session.subscription?.toString(),
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        const planId =
          sub.metadata?.planId || sub.items.data[0]?.price.nickname || "pro";
        if (userId) {
          await upsertSubscription({
            userId,
            plan: planId,
            customerId: sub.customer?.toString(),
            subscriptionId: sub.id,
            currentPeriodEnd: sub.current_period_end,
          });
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.metadata?.userId;
        if (userId) {
          await prisma.billingHistory.create({
            data: {
              userId,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_paid ?? 0,
              currency: invoice.currency?.toUpperCase() || "PLN",
              status: invoice.paid ? "paid" : "pending",
              description: invoice.lines?.data?.[0]?.description ?? "Invoice",
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) {
          await prisma.subscription.updateMany({
            where: { userId },
            data: {
              status: "canceled",
              canceledAt: new Date(),
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
