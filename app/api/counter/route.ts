import { NextResponse } from "next/server";

// Dynamic API - requires Node.js runtime
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In-memory counter (resets on cold start, but works on Vercel)
// For persistent storage, use Vercel KV or a database
const memoryCounter = {
  total: 2547, // Base visits
  today: 0,
  date: new Date().toISOString().split("T")[0],
  uniqueToday: new Set<string>(),
};

function getVisitorHash(request: Request): string {
  const ip = request.headers.get("x-forwarded-for") ||
             request.headers.get("x-real-ip") ||
             "unknown";
  const userAgent = request.headers.get("user-agent") || "";
  const today = new Date().toISOString().split("T")[0];
  // Simple hash without crypto for edge compatibility
  return Buffer.from(ip + userAgent.slice(0, 50) + today).toString("base64").slice(0, 32);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "get";

  const today = new Date().toISOString().split("T")[0];

  // Reset daily counter if new day
  if (memoryCounter.date !== today) {
    memoryCounter.today = 0;
    memoryCounter.date = today;
    memoryCounter.uniqueToday = new Set<string>();
  }

  if (action === "count") {
    const visitorHash = getVisitorHash(request);

    // Check if unique visit today
    if (!memoryCounter.uniqueToday.has(visitorHash)) {
      memoryCounter.total++;
      memoryCounter.today++;
      memoryCounter.uniqueToday.add(visitorHash);

      // Limit set size
      if (memoryCounter.uniqueToday.size > 10000) {
        const arr = Array.from(memoryCounter.uniqueToday);
        memoryCounter.uniqueToday = new Set(arr.slice(-5000));
      }
    }
  }

  return NextResponse.json({
    success: true,
    total: memoryCounter.total,
    today: memoryCounter.today,
    date: memoryCounter.date,
  });
}
