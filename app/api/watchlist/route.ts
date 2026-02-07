import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { resolve } from "path";
import crypto from "crypto";
import { auth } from "@/lib/auth";

type ItemType = "stock" | "crypto" | "currency" | "index";
type WatchlistItem = {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: ItemType;
  note?: string;
  createdAt: string;
};

const DATA_DIR = "/tmp/fusionfinance";
const FILE_PATH = resolve(DATA_DIR, "watchlist.json");

async function loadItems(): Promise<WatchlistItem[]> {
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    return JSON.parse(raw) as WatchlistItem[];
  } catch {
    return [];
  }
}

async function saveItems(items: WatchlistItem[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
}

async function getUserId() {
  const session = await auth?.();
  return session?.user?.id || "local";
}

export async function GET() {
  const userId = await getUserId();
  const items = await loadItems();
  return NextResponse.json(items.filter(i => i.userId === userId));
}

export async function POST(request: NextRequest) {
  const userId = await getUserId();
  const body = await request.json();
  const { symbol, name, type, note } = body;
  if (!symbol || !type) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const items = await loadItems();
  if (items.some(i => i.userId === userId && i.symbol === symbol)) {
    return NextResponse.json({ error: "Already in watchlist" }, { status: 400 });
  }

  const item: WatchlistItem = {
    id: crypto.randomUUID(),
    userId,
    symbol: String(symbol).toUpperCase(),
    name: name || symbol,
    type,
    note,
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  await saveItems(items);
  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest) {
  const userId = await getUserId();
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  const items = await loadItems();
  const filtered = items.filter(i => !(i.userId === userId && i.symbol === symbol));
  await saveItems(filtered);
  return NextResponse.json({ success: true });
}
