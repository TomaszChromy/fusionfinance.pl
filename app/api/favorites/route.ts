import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
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
    const { articleId, title, url, imageUrl } = body;

    if (!articleId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: { userId: session.user.id, articleId },
    });

    if (existing) {
      return NextResponse.json({ error: "Already favorited" }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        articleId,
        title,
        url,
        imageUrl,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error creating favorite:", error);
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
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: { userId: session.user.id, articleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

