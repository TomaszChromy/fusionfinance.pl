import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Article } from "@prisma/client";
import { FALLBACK_ARTICLES } from "./fallback";

type ListItem = Omit<Article, "content"> & { content?: never };
type FallbackArticle = typeof FALLBACK_ARTICLES[number];

async function getPrismaSafe() {
  try {
    const mod = await import("@/lib/prisma");
    return mod.prisma || null;
  } catch {
    return null;
  }
}

function normalizeFallbackArticle(article: FallbackArticle): ListItem {
  const publishedAt = new Date(article.publishedAt);
  return {
    id: article.slug,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    coverImage: article.coverImage ?? null,
    category: article.category ?? null,
    tags: article.tags ?? [],
    source: article.source ?? "FusionFinance.pl",
    publishedAt,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  };
}

const FALLBACK_LIST = FALLBACK_ARTICLES.map(normalizeFallbackArticle);

function applyFilters(items: ListItem[], category?: string, search?: string, tag?: string) {
  return items.filter(item => {
    const matchesCategory = category ? item.category?.toLowerCase() === category.toLowerCase() : true;
    const matchesTag = tag ? item.tags?.some(t => t.toLowerCase() === tag.toLowerCase()) : true;
    const matchesSearch = search
      ? (item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase()))
      : true;
    return matchesCategory && matchesTag && matchesSearch;
  });
}

function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return items.slice(start, end);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10), 1), 50);
  const category = searchParams.get("category") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const search = searchParams.get("search") || undefined;

  const prisma = await getPrismaSafe();

  try {
    if (prisma) {
      const where: Record<string, unknown> = {};
      if (category) where.category = { equals: category, mode: "insensitive" };
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { summary: { contains: search, mode: "insensitive" } },
        ];
      }
      if (tag) {
        where.tags = { hasSome: [tag] };
      }

      const [total, items] = await Promise.all([
        prisma.article.count({ where }),
        prisma.article.findMany({
          where,
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            summary: true,
            coverImage: true,
            category: true,
            tags: true,
            source: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
      ]);

      return NextResponse.json({
        items,
        total,
        page,
        pageCount: Math.ceil(total / limit),
        source: "db",
      });
    }
  } catch (error) {
    console.error("[articles] DB error, falling back:", error);
  }

  const filtered = applyFilters(FALLBACK_LIST, category, search, tag);
  const total = filtered.length;
  const items = paginate(filtered, page, limit);

  return NextResponse.json({
    items,
    total,
    page,
    pageCount: Math.ceil(total / limit) || 1,
    source: "fallback",
  });
}
