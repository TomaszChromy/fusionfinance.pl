"use server";

import { NextRequest, NextResponse } from "next/server";

type RateMap = Record<string, number>;

const FALLBACK_RATES: RateMap = {
  PLN: 1,
  EUR: 4.32,
  USD: 3.95,
  GBP: 5.02,
  CHF: 4.46,
  JPY: 0.027,
  CZK: 0.18,
  NOK: 0.35,
};

async function fetchNBPRates(): Promise<RateMap> {
  const res = await fetch("https://api.nbp.pl/api/exchangerates/tables/A/?format=json", {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`NBP API error: ${res.status}`);
  }

  const data = await res.json();
  const table = Array.isArray(data) ? data[0] : null;
  const rates: RateMap = { PLN: 1 };

  if (table?.rates) {
    for (const item of table.rates) {
      if (!item.code || typeof item.mid !== "number") continue;
      rates[item.code] = item.mid;
    }
  }

  return rates;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get("symbols");
  const symbols = symbolsParam ? symbolsParam.split(",").map(s => s.trim().toUpperCase()) : [];

  try {
    const rates = await fetchNBPRates();
    const payload = symbols.length > 0
      ? Object.fromEntries(symbols.map(code => [code, rates[code] ?? FALLBACK_RATES[code]]))
      : rates;

    return NextResponse.json({
      success: true,
      base: "PLN",
      rates: payload,
      source: "nbp",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Forex API error:", error);
    const payload = symbols.length > 0
      ? Object.fromEntries(symbols.map(code => [code, FALLBACK_RATES[code]]))
      : FALLBACK_RATES;

    return NextResponse.json({
      success: true,
      base: "PLN",
      rates: payload,
      source: "fallback",
      timestamp: new Date().toISOString(),
    });
  }
}
