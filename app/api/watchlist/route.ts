import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchlist = await prisma.watchlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { symbol, name, type } = body;

    if (!symbol || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if already in watchlist
    const existing = await prisma.watchlistItem.findFirst({
      where: { userId: session.user.id, symbol },
    });

    if (existing) {
      return NextResponse.json({ error: "Already in watchlist" }, { status: 400 });
    }

    const item = await prisma.watchlistItem.create({
      data: {
        userId: session.user.id,
        symbol,
        name: name || symbol,
        type,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
    }

    await prisma.watchlistItem.deleteMany({
      where: { userId: session.user.id, symbol },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

