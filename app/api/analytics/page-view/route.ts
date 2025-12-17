import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/analytics/page-view
 * Śledzenie widoku strony
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, path, title, referrer, duration, userAgent } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: "Path is required" },
        { status: 400 }
      );
    }

    const pageView = await prisma.pageView.create({
      data: {
        userId,
        path,
        title,
        referrer,
        duration,
        userAgent,
      },
    });

    return NextResponse.json(pageView, { status: 201 });
  } catch (error) {
    console.error("Analytics page-view error:", error);
    return NextResponse.json(
      { error: "Failed to record page view" },
      { status: 500 }
    );
  }
}
