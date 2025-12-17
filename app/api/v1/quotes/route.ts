import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * GET /api/v1/quotes
 * Publiczne API do pobierania kursów walut
 * Wymaga: ?apiKey=xxx
 */
export async function GET(request: NextRequest) {
  try {
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

    // TODO: Pobierz rzeczywiste dane kursów z RSS lub bazy
    // Na razie zwrócę mock data
    const quotes = pairs.split(",").map((pair) => ({
      pair: pair.trim(),
      bid: (Math.random() * 5 + 3).toFixed(4),
      ask: (Math.random() * 5 + 3.1).toFixed(4),
      timestamp: new Date().toISOString(),
    }));

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
