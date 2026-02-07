import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FALLBACK_ARTICLES } from "../fallback";

async function getPrismaSafe() {
  try {
    const mod = await import("@/lib/prisma");
    return mod.prisma || null;
  } catch (error) {
    console.warn("[article] Prisma unavailable, using fallback.", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const prisma = await getPrismaSafe();
  const slug = params.slug;

  try {
    if (prisma) {
      const article = await prisma.article.findUnique({
        where: { slug },
      });
      if (article) {
        return NextResponse.json({ item: article, source: "db" });
      }
    }
  } catch (error) {
    console.error("[article] DB error, falling back:", error);
  }

  const fallback = FALLBACK_ARTICLES.find(a => a.slug === slug);
  if (!fallback) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item: { id: fallback.slug, ...fallback }, source: "fallback" });
}
