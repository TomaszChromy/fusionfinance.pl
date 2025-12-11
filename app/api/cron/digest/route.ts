import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWeeklyDigest } from "@/lib/email";

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// Example: Every Sunday at 10:00 AM
export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active weekly subscribers
    const subscribers = await prisma.newsletterSubscription.findMany({
      where: {
        isActive: true,
        frequency: "weekly",
      },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers to send to" });
    }

    // Mock articles for demo (in production, fetch from database or RSS)
    const topArticles = [
      { title: "Bitcoin przekracza $100,000 - Historyczny moment", url: "https://fusionfinance.pl/artykul?title=bitcoin-100k" },
      { title: "WIG20 bije rekordy wszech czasów", url: "https://fusionfinance.pl/artykul?title=wig20-rekord" },
      { title: "NBP utrzymuje stopy procentowe", url: "https://fusionfinance.pl/artykul?title=nbp-stopy" },
      { title: "Złoty umacnia się względem euro", url: "https://fusionfinance.pl/artykul?title=zloty-euro" },
      { title: "AI rewolucjonizuje sektor finansowy", url: "https://fusionfinance.pl/artykul?title=ai-finanse" },
    ];

    // Send emails to all subscribers
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const result = await sendWeeklyDigest(subscriber.email, topArticles);
      if (result.success) {
        sent++;
      } else {
        failed++;
        console.error(`Failed to send to ${subscriber.email}:`, result.error);
      }

      // Rate limiting - wait 100ms between emails
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      message: "Weekly digest sent",
      stats: {
        total: subscribers.length,
        sent,
        failed,
      },
    });
  } catch (error) {
    console.error("Digest cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET endpoint for manual testing
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get("test");

  if (testEmail) {
    // Send test email
    const testArticles = [
      { title: "Test artykuł 1", url: "https://fusionfinance.pl" },
      { title: "Test artykuł 2", url: "https://fusionfinance.pl" },
    ];

    const result = await sendWeeklyDigest(testEmail, testArticles);
    return NextResponse.json(result);
  }

  return NextResponse.json({
    message: "Weekly digest cron endpoint",
    usage: "POST /api/cron/digest with Bearer token, or GET ?test=email@example.com",
  });
}

