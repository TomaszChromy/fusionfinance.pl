import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, frequency = "weekly" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email jest wymagany" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Nieprawidłowy format email" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ error: "Ten email jest już zapisany do newslettera" }, { status: 400 });
      }
      // Reactivate subscription
      await prisma.newsletterSubscription.update({
        where: { email },
        data: { isActive: true, frequency },
      });
      return NextResponse.json({ message: "Subskrypcja została reaktywowana" });
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: {
        email,
        frequency,
        isActive: true,
      },
    });

    // Send welcome email (non-blocking)
    if (process.env.RESEND_API_KEY) {
      sendWelcomeEmail(email).catch(console.error);
    }

    return NextResponse.json({ message: "Dziękujemy za zapisanie się do newslettera!" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Wystąpił błąd" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email) {
      return NextResponse.json({ error: "Email jest wymagany" }, { status: 400 });
    }

    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (!subscription) {
      return NextResponse.json({ error: "Nie znaleziono subskrypcji" }, { status: 404 });
    }

    // Simple token validation (in production, use proper token)
    if (token !== subscription.id) {
      return NextResponse.json({ error: "Nieprawidłowy token" }, { status: 401 });
    }

    await prisma.newsletterSubscription.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Wypisano z newslettera" });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json({ error: "Wystąpił błąd" }, { status: 500 });
  }
}

