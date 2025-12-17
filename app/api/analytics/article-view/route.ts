import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/analytics/article-view
 * Śledzenie widoku artykułu
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, articleId, title, slug, duration, scrollDepth } = await request.json();

    if (!articleId || !slug) {
      return NextResponse.json(
        { error: "ArticleId and slug are required" },
        { status: 400 }
      );
    }

    const articleView = await prisma.articleView.create({
      data: {
        userId,
        articleId,
        title,
        slug,
        duration,
        scrollDepth,
      },
    });

    return NextResponse.json(articleView, { status: 201 });
  } catch (error) {
    console.error("Analytics article-view error:", error);
    return NextResponse.json(
      { error: "Failed to record article view" },
      { status: 500 }
    );
  }
}
