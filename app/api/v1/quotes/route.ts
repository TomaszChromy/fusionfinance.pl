import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPlnRates } from "@/lib/rates";
import { auth } from "@/lib/auth";
import { hasFeatureAccess } from "@/lib/features";

/**
 * GET /api/v1/quotes
 * Publiczne API do pobierania kursów walut
 * Wymaga: ?apiKey=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const canUseApi = await hasFeatureAccess(session?.user?.id, "api.quotes");
    if (!canUseApi) {
      return NextResponse.json(
        { error: "API dostępne tylko w planie BASIC/PRO. Zaloguj się i ulepsz plan." },
        { status: 402 }
      );
    }

    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");
    const pairs = searchParams.get("pairs") || "EUR/PLN,USD/PLN,GBP/PLN";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing apiKey parameter" },
        { status: 401 }
      );
    }

    // Weryfikuj API key
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });

    if (!key || !key.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive API key" },
        { status: 401 }
      );
    }

    // Sprawdź rate limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (
      key.lastRequestAt &&
      key.lastRequestAt.getTime() > today.getTime() &&
      key.requestsToday >= key.rateLimit
    ) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Zaloguj użycie API
    const startTime = Date.now();

    const { rates, fetchedAt, source } = await getPlnRates();

    const quotes = pairs.split(",").map((pairRaw) => {
      const pair = pairRaw.trim().toUpperCase();
      const [base, quote] = pair.split("/");

      if (!base || !quote) {
        return {
          pair,
          error: "Invalid pair format. Use BASE/QUOTE, e.g., EUR/PLN",
        };
      }

      // We primarily support */PLN and PLN/* conversions
      let mid: number | null = null;
      if (quote === "PLN" && rates[base]) {
        mid = rates[base];
      } else if (base === "PLN" && rates[quote]) {
        mid = 1 / rates[quote];
      }

      if (mid === null) {
        return {
          pair,
          error: "Pair not supported",
        };
      }

      const spread = mid * 0.0015; // ~0.15% spread
      const bid = +(mid - spread).toFixed(4);
      const ask = +(mid + spread).toFixed(4);

      return {
        pair,
        bid,
        ask,
        mid: +mid.toFixed(4),
        timestamp: fetchedAt,
        source,
      };
    });

    const responseTime = Date.now() - startTime;

    // Aktualizuj counter
    await prisma.apiKey.update({
      where: { id: key.id },
      data: {
        requestsToday: key.requestsToday + 1,
        lastRequestAt: new Date(),
      },
    });

    // Zaloguj usage
    await prisma.apiUsage.create({
      data: {
        apiKeyId: key.id,
        endpoint: "/api/v1/quotes",
        method: "GET",
        statusCode: 200,
        responseTime,
      },
    });

    return NextResponse.json({
      status: "success",
      data: quotes,
      meta: {
        apiVersion: "1.0",
        requestsRemaining: key.rateLimit - key.requestsToday - 1,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
