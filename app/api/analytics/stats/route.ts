import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/analytics/stats?range=7d
 * Pobieranie statystyk dla dashboardu
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    // Oblicz datę rozpoczęcia
    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case "1d":
        startDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Pobierz statystyki
    const totalViews = await prisma.pageView.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    const uniqueUsers = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: startDate },
        userId: { not: null },
      },
      select: { userId: true },
      distinct: ["userId"],
    });

    const totalArticleViews = await prisma.articleView.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Top artykuły
    const topArticles = await prisma.articleView.groupBy({
      by: ["articleId", "title"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { id: true },
      orderBy: {
        _count: { id: "desc" },
      },
      take: 10,
    });

    // Średni czas spędzony
    const avgDuration = await prisma.pageView.aggregate({
      where: {
        createdAt: { gte: startDate },
        duration: { not: null },
      },
      _avg: { duration: true },
    });

    // Bounce rate (strony bez zdarzenia w ciągu 30 sekund)
    const bounceViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: startDate },
        duration: { lt: 30 },
      },
      select: { id: true },
    });

    const bounceRate =
      totalViews > 0 ? ((bounceViews.length / totalViews) * 100).toFixed(2) : 0;

    return NextResponse.json({
      range,
      period: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
      totalViews,
      uniqueUsers: uniqueUsers.length,
      totalArticleViews,
      avgDuration: avgDuration._avg.duration || 0,
      bounceRate: parseFloat(String(bounceRate)),
      topArticles: topArticles.map((article: { articleId: string; title: string; _count: { id: number } }) => ({
        articleId: article.articleId,
        title: article.title,
        views: article._count.id,
      })),
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
