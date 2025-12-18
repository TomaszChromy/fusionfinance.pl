import { NextResponse } from "next/server";
import { getExperiments } from "@/lib/ab-testing";

type ABEventData = {
  experimentId?: string;
  variant?: string;
};

type ABEvent = {
  eventData: ABEventData | null;
};

/**
 * GET /api/ab-testing
 * Pobierz statystyki A/B testów (mock bez Prisma)
 */
export async function GET() {
  try {
    const experiments = getExperiments();
    const stats = [];

    for (const exp of experiments) {
      // Mock events - bez Prisma
      const events: ABEvent[] = [];

      // Filtruj po experimentId
      const expEvents = events.filter(
        (e: ABEvent) => (e.eventData as ABEventData)?.experimentId === exp.id
      );

      // Grupuj po wariantach
      const variantStats: Record<string, number> = {};
      exp.variants.forEach((v) => (variantStats[v] = 0));

      expEvents.forEach((e: ABEvent) => {
        const variant = (e.eventData as ABEventData)?.variant;
        if (variant && variantStats[variant] !== undefined) {
          variantStats[variant]++;
        }
      });

      const totalConversions = Object.values(variantStats).reduce((a, b) => a + b, 0);

      stats.push({
        id: exp.id,
        name: exp.name,
        variants: exp.variants.map((v) => ({
          name: v,
          conversions: variantStats[v],
          rate: totalConversions > 0 ? ((variantStats[v] / totalConversions) * 100).toFixed(1) : "0",
        })),
        totalConversions,
      });
    }

    return NextResponse.json({ experiments: stats });
  } catch (error) {
    console.error("AB testing stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

