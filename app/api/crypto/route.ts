import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank?: number;
};

type CryptoItem = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  image?: string;
  rank?: number;
};

const FALLBACK: CryptoItem[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 97450.32, change24h: 2.45, marketCap: 1.92e12, volume24h: 48.2e9 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3654.18, change24h: -1.23, marketCap: 439e9, volume24h: 21.5e9 },
  { id: "bnb", symbol: "BNB", name: "BNB", price: 642.55, change24h: 0.87, marketCap: 96e9, volume24h: 2.1e9 },
  { id: "solana", symbol: "SOL", name: "Solana", price: 228.45, change24h: -3.21, marketCap: 108e9, volume24h: 5.4e9 },
  { id: "xrp", symbol: "XRP", name: "XRP", price: 2.34, change24h: 5.67, marketCap: 134e9, volume24h: 8.9e9 },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 1.12, change24h: 1.45, marketCap: 39e9, volume24h: 1.2e9 },
];

const cache = new Map<string, { timestamp: number; items: CryptoItem[] }>();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

const buildApiUrl = (limit: number) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;

async function fetchCoins(limit: number): Promise<CryptoItem[]> {
  const res = await fetch(buildApiUrl(limit), {
    headers: { "User-Agent": "FusionFinance/crypto" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Coingecko status ${res.status}`);
  const data: Coin[] = await res.json();

  return data.slice(0, limit).map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
    image: coin.image,
    rank: coin.market_cap_rank,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);
  const cacheKey = `crypto-${limit}`;

  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ items: cached.items, cached: true });
  }

  try {
    const items = await fetchCoins(limit);
    cache.set(cacheKey, { timestamp: now, items });
    return NextResponse.json({ items, cached: false });
  } catch (error) {
    console.warn("[crypto] fallback due to error:", error);
    return NextResponse.json({ items: FALLBACK.slice(0, limit), cached: false, fallback: true });
  }
}
