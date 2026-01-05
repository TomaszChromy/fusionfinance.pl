import { NextRequest, NextResponse } from "next/server";

// Dynamic API - requires Node.js runtime
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface CoinGeckoSimplePrice {
  [key: string]: {
    usd?: number;
    pln?: number;
    usd_24h_change?: number;
    usd_market_cap?: number;
  };
}

// Fallback data when API fails
const FALLBACK_DATA = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 97500, change24h: 2.5, marketCap: 1920000000000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3654, change24h: -1.2, marketCap: 439000000000 },
  { id: "solana", symbol: "SOL", name: "Solana", price: 228, change24h: -3.2, marketCap: 108000000000 },
  { id: "ripple", symbol: "XRP", name: "XRP", price: 2.34, change24h: 5.6, marketCap: 134000000000 },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 1.12, change24h: 1.4, marketCap: 39000000000 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "markets"; // markets or simple
  const ids = searchParams.get("ids") || "bitcoin,ethereum,solana,ripple,cardano";
  const currency = searchParams.get("currency") || "usd";

  try {
    let data;

    if (type === "simple") {
      // Simple price endpoint
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currency},pln&include_24hr_change=true&include_market_cap=true`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "FusionFinance/1.0",
          "Accept": "application/json",
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const rawData: CoinGeckoSimplePrice = await response.json();
      
      // Transform to consistent format
      data = Object.entries(rawData).map(([id, info]) => ({
        id,
        symbol: id.toUpperCase().slice(0, 3),
        name: id.charAt(0).toUpperCase() + id.slice(1),
        price: info.usd || 0,
        pricePln: info.pln || 0,
        change24h: info.usd_24h_change || 0,
        marketCap: info.usd_market_cap || 0,
      }));
    } else {
      // Markets endpoint (default)
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "FusionFinance/1.0",
          "Accept": "application/json",
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const rawData: CoinGeckoMarketData[] = await response.json();
      
      data = rawData.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        changeValue: coin.price_change_24h,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
      }));
    }

    return NextResponse.json({
      success: true,
      data,
      source: "coingecko",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("CoinGecko API error:", error);
    
    // Return fallback data
    return NextResponse.json({
      success: true,
      data: FALLBACK_DATA,
      source: "fallback",
      timestamp: new Date().toISOString(),
    });
  }
}

