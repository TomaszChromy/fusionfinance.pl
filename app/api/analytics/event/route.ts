import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/analytics/event
 * Śledzenie zdarzeń (click, share, bookmark, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, eventType, eventData } = await request.json();

    if (!eventType) {
      return NextResponse.json(
        { error: "eventType is required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        userId,
        eventType,
        eventData,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Analytics event error:", error);
    return NextResponse.json(
      { error: "Failed to record event" },
      { status: 500 }
    );
  }
}
