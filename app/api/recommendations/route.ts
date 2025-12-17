import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/recommendations?limit=5
 * Pobierz spersonalizowane rekomendacje artykułów dla zalogowanego użytkownika
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!session?.user?.id) {
      // Jeśli użytkownik niezalogowany, zwróć najpopularniejsze artykuły
      const popularArticles = await prisma.articleView.groupBy({
        by: ["articleId", "title"],
        _count: { id: true },
        orderBy: {
          _count: { id: "desc" },
        },
        take: limit,
      });

      return NextResponse.json({
        type: "popular",
        recommendations: popularArticles.map((article) => ({
          articleId: article.articleId,
          title: article.title,
          views: article._count.id,
          reason: "Popular this week",
        })),
      });
    }

    // Dla zalogowanego użytkownika - analiza historii
    const userViews = await prisma.articleView.findMany({
      where: { userId: session.user.id },
      select: { articleId: true, title: true, duration: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    if (userViews.length === 0) {
      // Jeśli brak historii, zwróć popularne
      const popularArticles = await prisma.articleView.groupBy({
        by: ["articleId", "title"],
        _count: { id: true },
        orderBy: {
          _count: { id: "desc" },
        },
        take: limit,
      });

      return NextResponse.json({
        type: "popular",
        recommendations: popularArticles.map((article) => ({
          articleId: article.articleId,
          title: article.title,
          views: article._count.id,
          reason: "Popular this week",
        })),
      });
    }

    // Ekstrakcja słów kluczowych z historii
    const keywords = extractKeywords(userViews.map((v) => v.title));

    // Szukaj artykułów zawierających podobne słowa kluczowe
    const recommendedArticles = await prisma.articleView.findMany({
      where: {
        OR: keywords.map((keyword) => ({
          title: {
            contains: keyword,
            mode: "insensitive" as const,
          },
        })),
        NOT: {
          articleId: {
            in: userViews.map((v) => v.articleId),
          },
        },
      },
      select: { articleId: true, title: true },
      distinct: ["articleId"],
      take: limit * 2, // Pobierz więcej aby mieć wybór
    });

    // Groupuj i sortuj po popularności
    const grouped = await Promise.all(
      recommendedArticles.map(async (article) => {
        const viewCount = await prisma.articleView.count({
          where: { articleId: article.articleId },
        });
        return { ...article, views: viewCount };
      })
    );

    const sorted = grouped
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return NextResponse.json({
      type: "personalized",
      recommendations: sorted.map((article) => ({
        articleId: article.articleId,
        title: article.title,
        views: article.views,
        reason: "Based on your interests",
      })),
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

// Helper function to extract keywords from titles
function extractKeywords(titles: string[]): string[] {
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "i",
    "o",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "w",
    "z",
    "i",
    "na",
    "do",
    "nie",
    "się",
    "to",
    "jest",
  ]);

  const words = titles
    .join(" ")
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        !stopWords.has(word) &&
        /^[a-ząćęłńóśźż]+$/i.test(word)
    );

  // Zwróć top 5 słów
  const wordCounts = new Map<string, number>();
  words.forEach((word) => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });

  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}
