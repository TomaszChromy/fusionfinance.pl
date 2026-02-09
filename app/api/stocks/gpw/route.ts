"use server";

import { NextRequest, NextResponse } from "next/server";

interface StockRow {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
}

const FALLBACK_INDICES: StockRow[] = [
  { symbol: "WIG20", name: "WIG20", price: 2345.67, change: 23.45, changePercent: 1.01, volume: "1.2B" },
  { symbol: "WIG", name: "WIG", price: 78234.12, change: 456.78, changePercent: 0.59, volume: "2.1B" },
  { symbol: "mWIG40", name: "mWIG40", price: 5678.90, change: -34.56, changePercent: -0.61, volume: "0.8B" },
  { symbol: "sWIG80", name: "sWIG80", price: 21345.67, change: 123.45, changePercent: 0.58, volume: "0.4B" },
];

const FALLBACK_WIG20: StockRow[] = [
  { symbol: "PKO", name: "PKO Bank Polski", price: 54.32, change: 1.23, changePercent: 2.32, volume: "2.4M" },
  { symbol: "PKN", name: "PKN Orlen", price: 68.45, change: -0.85, changePercent: -1.23, volume: "1.8M" },
  { symbol: "PZU", name: "PZU SA", price: 42.18, change: 0.56, changePercent: 1.35, volume: "1.2M" },
  { symbol: "PEO", name: "Bank Pekao", price: 156.8, change: 2.4, changePercent: 1.55, volume: "0.9M" },
  { symbol: "KGH", name: "KGHM", price: 142.35, change: -1.65, changePercent: -1.15, volume: "0.8M" },
  { symbol: "LPP", name: "LPP SA", price: 14250, change: 350, changePercent: 2.52, volume: "12K" },
  { symbol: "CDR", name: "CD Projekt", price: 118.9, change: 3.2, changePercent: 2.77, volume: "1.5M" },
  { symbol: "DNP", name: "Dino Polska", price: 432.5, change: -5.5, changePercent: -1.26, volume: "0.3M" },
  { symbol: "ALE", name: "Allegro", price: 32.45, change: 0.78, changePercent: 2.46, volume: "3.2M" },
  { symbol: "SPL", name: "Santander PL", price: 456.2, change: 8.3, changePercent: 1.85, volume: "0.2M" },
];

const INDEX_SYMBOLS = "wig20,wig,mwig40,swig80";
const WIG20_SYMBOLS = "pko,pkn,pzu,peo,kgh,lpp,cdr,dnp,ale,spl";

function parseCsvLine(line: string): StockRow | null {
  // Symbol,Date,Time,Open,High,Low,Close,Volume
  const parts = line.split(",");
  if (parts.length < 8) return null;
  const [symbol,, , open, , , close, volumeRaw] = parts;
  const openNum = parseFloat(open);
  const closeNum = parseFloat(close);
  const change = closeNum - openNum;
  const changePct = openNum ? (change / openNum) * 100 : 0;
  const volume = volumeRaw && volumeRaw !== "0" ? volumeRaw : undefined;
  return {
    symbol: symbol.toUpperCase(),
    name: symbol.toUpperCase(),
    price: closeNum,
    change,
    changePercent: changePct,
    volume,
  };
}

async function fetchCsv(symbols: string): Promise<StockRow[]> {
  const url = `https://stooq.pl/q/l/?s=${symbols}&f=sd2t2ohlcvc&e=csv`;
  const res = await fetch(url, { cache: "no-store", headers: { Accept: "text/csv" } });
  if (!res.ok) throw new Error(`Stooq error ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split("\n").slice(1); // drop header
  const parsed = lines
    .map(parseCsvLine)
    .filter((row): row is StockRow => row !== null);
  return parsed.map(row => ({
    symbol: row.symbol,
    name: row.name,
    price: row.price,
    change: row.change,
    changePercent: row.changePercent,
    volume: row.volume,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") === "indices" ? "indices" : "wig20";

  try {
    const rows = tab === "indices" ? await fetchCsv(INDEX_SYMBOLS) : await fetchCsv(WIG20_SYMBOLS);
    const enriched = rows.map(row => ({
      ...row,
      // simple display name mapping
      name: row.symbol === "WIG20" ? "WIG20" : row.name,
    }));

    return NextResponse.json({
      success: true,
      data: enriched,
      source: "stooq",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GPW API error:", error);
    const fallback = tab === "indices" ? FALLBACK_INDICES : FALLBACK_WIG20;
    return NextResponse.json({
      success: true,
      data: fallback,
      source: "fallback",
      timestamp: new Date().toISOString(),
    });
  }
}
