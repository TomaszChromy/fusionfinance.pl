import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getExperiments } from "@/lib/ab-testing";

/**
 * GET /api/ab-testing
 * Pobierz statystyki A/B testów
 */
export async function GET() {
  try {
    const experiments = getExperiments();
    const stats = [];

    for (const exp of experiments) {
      // Pobierz zdarzenia dla każdego eksperymentu
      const events = await prisma.event.findMany({
        where: {
          eventType: "ab_conversion",
        },
        select: { eventData: true },
      });

      // Filtruj po experimentId
      const expEvents = events.filter(
        (e) => (e.eventData as { experimentId?: string })?.experimentId === exp.id
      );

      // Grupuj po wariantach
      const variantStats: Record<string, number> = {};
      exp.variants.forEach((v) => (variantStats[v] = 0));

      expEvents.forEach((e) => {
        const variant = (e.eventData as { variant?: string })?.variant;
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

