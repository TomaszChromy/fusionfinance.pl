import { prisma } from "./prisma";

const featurePlan: Record<string, "free" | "basic" | "pro"> = {
  "ai.chat": "pro",
  "ai.summary": "pro",
  "alerts.price": "basic",
  "rss.premium": "basic",
  "api.quotes": "basic",
};

export async function hasFeatureAccess(
  userId: string | undefined,
  feature: keyof typeof featurePlan
): Promise<boolean> {
  const requiredPlan = featurePlan[feature] || "free";
  if (requiredPlan === "free") return true;
  if (!userId) return false;
  if (!prisma) return false;

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) return false;
  if (subscription.status !== "active") return false;

  if (requiredPlan === "basic") return subscription.plan !== "free";
  if (requiredPlan === "pro") return subscription.plan === "pro" || subscription.plan === "enterprise";

  return false;
}
