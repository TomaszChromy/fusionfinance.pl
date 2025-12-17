import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface PremiumAnalysis {
  id: string;
  title: string;
  summary: string;
  category: "stocks" | "crypto" | "forex" | "macro";
  publishedAt: string;
  author: string;
  readTime: number;
  isPremium: boolean;
}

// Przykładowe analizy (w produkcji z bazy danych)
const ANALYSES: PremiumAnalysis[] = [
  {
    id: "1",
    title: "Analiza techniczna WIG20 - Grudzień 2024",
    summary: "Kompleksowa analiza wsparć, oporów i formacji cenowych głównego indeksu GPW...",
    category: "stocks",
    publishedAt: "2024-12-15",
    author: "Jan Kowalski, CFA",
    readTime: 12,
    isPremium: true,
  },
  {
    id: "2",
    title: "Bitcoin przed halvingiem - co mówią dane on-chain?",
    summary: "Głęboka analiza metryk blockchain i ich wpływ na cenę BTC...",
    category: "crypto",
    publishedAt: "2024-12-14",
    author: "Anna Nowak",
    readTime: 15,
    isPremium: true,
  },
  {
    id: "3",
    title: "EUR/PLN - perspektywy na 2025",
    summary: "Analiza fundamentalna i techniczna kursu euro względem złotego...",
    category: "forex",
    publishedAt: "2024-12-13",
    author: "Piotr Wiśniewski",
    readTime: 10,
    isPremium: true,
  },
  {
    id: "4",
    title: "Inflacja w Polsce - co dalej?",
    summary: "Analiza trendów inflacyjnych i ich wpływ na politykę RPP...",
    category: "macro",
    publishedAt: "2024-12-12",
    author: "Maria Zielińska, PhD",
    readTime: 8,
    isPremium: false,
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Sprawdź subskrypcję użytkownika
    let hasPremium = false;
    if (session?.user?.id) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
      });
      hasPremium = subscription?.plan === "pro" || subscription?.plan === "enterprise";
    }

    let analyses = ANALYSES;
    if (category) {
      analyses = analyses.filter((a) => a.category === category);
    }

    // Dla użytkowników bez premium - ukryj pełną treść
    const result = analyses.map((a) => ({
      ...a,
      isLocked: a.isPremium && !hasPremium,
      summary: a.isPremium && !hasPremium ? a.summary.substring(0, 50) + "..." : a.summary,
    }));

    return NextResponse.json({
      analyses: result,
      hasPremium,
      total: analyses.length,
    });
  } catch (error) {
    console.error("Premium analyses error:", error);
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 });
  }
}

