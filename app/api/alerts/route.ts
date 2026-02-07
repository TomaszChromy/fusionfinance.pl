import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { resolve } from "path";
import crypto from "crypto";
import { auth } from "@/lib/auth";

type Alert = {
  id: string;
  userId: string;
  symbol: string;
  assetClass: string;
  condition: "above" | "below" | "percent";
  threshold: number;
  isActive: boolean;
  triggered: boolean;
  channel: "email" | "push";
  note?: string;
  createdAt: string;
};

const DATA_DIR = "/tmp/fusionfinance";
const FILE_PATH = resolve(DATA_DIR, "alerts.json");

async function loadAlerts(): Promise<Alert[]> {
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    return JSON.parse(raw) as Alert[];
  } catch {
    return [];
  }
}

async function saveAlerts(alerts: Alert[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(alerts, null, 2), "utf-8");
}

async function getUserId() {
  const session = await auth?.();
  return session?.user?.id || "local";
}

export async function GET() {
  const userId = await getUserId();
  const alerts = await loadAlerts();
  return NextResponse.json(alerts.filter(a => a.userId === userId));
}

export async function POST(request: NextRequest) {
  const userId = await getUserId();
  const body = await request.json();
  const { symbol, condition, threshold, channel, assetClass, note } = body;
  if (!symbol || threshold === undefined || !condition) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const alerts = await loadAlerts();
  const alert: Alert = {
    id: crypto.randomUUID(),
    userId,
    symbol: String(symbol).toUpperCase(),
    assetClass: assetClass || "stock",
    condition,
    threshold: Number(threshold),
    channel: channel === "email" ? "email" : "push",
    isActive: true,
    triggered: false,
    note: note || "",
    createdAt: new Date().toISOString(),
  };
  alerts.unshift(alert);
  await saveAlerts(alerts);
  return NextResponse.json(alert);
}

export async function PATCH(request: NextRequest) {
  const userId = await getUserId();
  const body = await request.json();
  const { id, isActive } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const alerts = await loadAlerts();
  const idx = alerts.findIndex(a => a.id === id && a.userId === userId);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  alerts[idx].isActive = Boolean(isActive);
  await saveAlerts(alerts);
  return NextResponse.json(alerts[idx]);
}

export async function DELETE(request: NextRequest) {
  const userId = await getUserId();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const alerts = await loadAlerts();
  const filtered = alerts.filter(a => !(a.id === id && a.userId === userId));
  await saveAlerts(filtered);
  return NextResponse.json({ success: true });
}
