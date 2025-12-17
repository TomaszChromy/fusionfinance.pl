import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/v1/api-keys
 * Tworzenie nowego klucza API dla użytkownika
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, name } = await request.json();

    if (!userId || !name) {
      return NextResponse.json(
        { error: "userId and name are required" },
        { status: 400 }
      );
    }

    // Generuj unikalny klucz API
    const key = `fus_${generateRandomString(32)}`;
    const secret = generateRandomString(64);

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        name,
        key,
        secret,
      },
    });

    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key,
      secret: apiKey.secret, // Pokaż secret tylko raz!
      createdAt: apiKey.createdAt,
    });
  } catch (error) {
    console.error("API key creation error:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/api-keys
 * Pobierz klucze API użytkownika (bez secrets!)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    // TODO: Validate token i pobierz userId

    // Tymczasowo: pobierz userId z query params (tylko dla dev!)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        key: true,
        isActive: true,
        rateLimit: true,
        requestsToday: true,
        lastRequestAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error("API keys fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/api-keys/[id]
 * Usuń klucz API
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await prisma.apiKey.delete({
      where: { id: keyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API key deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}

function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
