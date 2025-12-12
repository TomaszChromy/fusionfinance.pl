import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const COUNTER_FILE = path.join(process.cwd(), "data", "counter.json");

interface CounterData {
  total: number;
  today: number;
  date: string;
  uniqueToday: string[];
}

function initCounterData(): CounterData {
  return {
    total: 1247, // Start with some base visits
    today: 0,
    date: new Date().toISOString().split("T")[0],
    uniqueToday: [],
  };
}

function ensureDataDir() {
  const dataDir = path.dirname(COUNTER_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadCounterData(): CounterData {
  try {
    ensureDataDir();
    if (!fs.existsSync(COUNTER_FILE)) {
      const initial = initCounterData();
      fs.writeFileSync(COUNTER_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }

    const data = JSON.parse(fs.readFileSync(COUNTER_FILE, "utf-8")) as CounterData;
    const today = new Date().toISOString().split("T")[0];

    // Reset daily counter if new day
    if (data.date !== today) {
      data.today = 0;
      data.date = today;
      data.uniqueToday = [];
    }

    return data;
  } catch {
    return initCounterData();
  }
}

function saveCounterData(data: CounterData) {
  ensureDataDir();
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(data, null, 2));
}

function getVisitorHash(request: Request): string {
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  const today = new Date().toISOString().split("T")[0];
  return crypto.createHash("md5").update(ip + today).digest("hex");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "get";

  const data = loadCounterData();

  if (action === "count") {
    const visitorHash = getVisitorHash(request);

    // Check if unique visit today
    if (!data.uniqueToday.includes(visitorHash)) {
      data.total++;
      data.today++;
      data.uniqueToday.push(visitorHash);

      // Limit array size
      if (data.uniqueToday.length > 10000) {
        data.uniqueToday = data.uniqueToday.slice(-5000);
      }

      saveCounterData(data);
    }
  }

  return NextResponse.json({
    success: true,
    total: data.total,
    today: data.today,
    date: data.date,
  });
}

