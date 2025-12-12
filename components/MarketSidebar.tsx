"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import SparklineChart from "./SparklineChart";

interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  sparklineData?: number[];
}

interface EconomicEvent {
  time: string;
  event: string;
  impact: string;
  country: string;
}

// Static sparkline data to avoid hydration mismatch (no Math.random at module load)
const upTrend1 = [100, 101, 99, 102, 103, 101, 104, 105, 103, 106, 107, 105, 108, 109, 107, 110, 111, 109, 112, 114];
const upTrend2 = [100, 102, 101, 103, 102, 104, 105, 103, 106, 105, 107, 108, 106, 109, 110, 108, 111, 112, 110, 113];
const downTrend = [114, 112, 113, 111, 112, 110, 109, 111, 108, 109, 107, 106, 108, 105, 106, 104, 103, 105, 102, 100];
const neutralTrend = [100, 101, 99, 100, 102, 100, 101, 99, 100, 101, 99, 100, 102, 100, 99, 101, 100, 99, 101, 100];

// Fallback dane walutowe (bez UAH)
const fallbackForex: MarketData[] = [
  { symbol: "EUR/PLN", name: "Euro", price: "4.3125", change: "+0.0085", changePercent: "+0.20%", sparklineData: upTrend1 },
  { symbol: "USD/PLN", name: "Dolar", price: "3.9845", change: "-0.0125", changePercent: "-0.31%", sparklineData: downTrend },
  { symbol: "GBP/PLN", name: "Funt", price: "5.0234", change: "+0.0156", changePercent: "+0.31%", sparklineData: upTrend2 },
  { symbol: "CHF/PLN", name: "Frank", price: "4.4567", change: "+0.0045", changePercent: "+0.10%", sparklineData: neutralTrend },
  { symbol: "EUR/USD", name: "Euro/Dolar", price: "1.0823", change: "+0.0034", changePercent: "+0.31%", sparklineData: upTrend1 },
];

// Fallback dane kryptowalut
const fallbackCrypto: MarketData[] = [
  { symbol: "BTC", name: "Bitcoin", price: "97,245", change: "+2,345", changePercent: "+2.47%", sparklineData: upTrend1 },
  { symbol: "ETH", name: "Ethereum", price: "3,456", change: "+89", changePercent: "+2.64%", sparklineData: upTrend2 },
  { symbol: "SOL", name: "Solana", price: "234.56", change: "+12.34", changePercent: "+5.56%", sparklineData: upTrend1 },
  { symbol: "XRP", name: "Ripple", price: "2.34", change: "+0.12", changePercent: "+5.41%", sparklineData: upTrend2 },
  { symbol: "ADA", name: "Cardano", price: "1.02", change: "+0.08", changePercent: "+8.51%", sparklineData: upTrend1 },
];

// Fallback dane giełdowe
const fallbackStocks: MarketData[] = [
  { symbol: "WIG20", name: "WIG20", price: "2,345.67", change: "+23.45", changePercent: "+1.01%", sparklineData: upTrend1 },
  { symbol: "WIG", name: "WIG", price: "78,234.12", change: "+456.78", changePercent: "+0.59%", sparklineData: upTrend2 },
  { symbol: "S&P500", name: "S&P 500", price: "6,032.38", change: "+33.64", changePercent: "+0.56%", sparklineData: upTrend1 },
  { symbol: "NASDAQ", name: "NASDAQ", price: "19,480.91", change: "+185.78", changePercent: "+0.96%", sparklineData: upTrend2 },
  { symbol: "DAX", name: "DAX", price: "19,933.62", change: "+156.23", changePercent: "+0.79%", sparklineData: neutralTrend },
];

// Kalendarz ekonomiczny
const defaultEvents: EconomicEvent[] = [
  { time: "10:00", event: "PKB Niemcy (r/r)", impact: "high", country: "DE" },
  { time: "11:00", event: "Inflacja CPI Polska", impact: "high", country: "PL" },
  { time: "14:30", event: "Wnioski o zasiłek USA", impact: "medium", country: "US" },
  { time: "16:00", event: "ISM Manufacturing PMI", impact: "high", country: "US" },
  { time: "20:00", event: "Decyzja FOMC ws. stóp", impact: "high", country: "US" },
];

function DataSection({ title, icon, data, showSparkline = true }: {
  title: string;
  icon: string;
  data: MarketData[];
  showSparkline?: boolean;
}) {
  return (
    <div className="bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors duration-300">
      {/* Nagłówek sekcji */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-[#0f1115] to-[#0c0d10]">
        <span className="text-base">{icon}</span>
        <h3 className="text-xs font-semibold text-[#f4f4f5] uppercase tracking-[0.1em]">{title}</h3>
      </div>

      {/* Dane */}
      <div className="divide-y divide-white/[0.03]">
        {data.map((item, i) => {
          const isPositive = item.change.startsWith('+');
          return (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-all duration-200 cursor-default group"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-200 flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#a1a1aa] group-hover:text-[#c9a962] transition-colors">
                    {item.symbol.slice(0, 3)}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-[#f4f4f5] block truncate">{item.symbol}</span>
                  <span className="text-[9px] text-[#71717a]">{item.name}</span>
                </div>
              </div>

              {/* Sparkline Chart */}
              {showSparkline && item.sparklineData && (
                <div className="mx-2 flex-shrink-0 hidden sm:block">
                  <SparklineChart
                    data={item.sparklineData}
                    width={60}
                    height={24}
                    showDot={false}
                    strokeWidth={1.5}
                  />
                </div>
              )}

              <div className="text-right flex-shrink-0">
                <span className="text-sm text-[#f4f4f5] font-mono font-medium block tabular-nums">{item.price}</span>
                <span className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${isPositive ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {isPositive ? '▲' : '▼'} {item.changePercent}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MarketSidebar() {
  const [forexData, setForexData] = useState<MarketData[]>(fallbackForex);
  const [cryptoData, setCryptoData] = useState<MarketData[]>(fallbackCrypto);
  const [stocksData, setStocksData] = useState<MarketData[]>(fallbackStocks);
  const [economicEvents] = useState<EconomicEvent[]>(defaultEvents);

  useEffect(() => {
    // Fetch forex data from NBP API
    async function fetchForex() {
      try {
        const res = await fetch("https://api.nbp.pl/api/exchangerates/tables/A?format=json");
        if (!res.ok) return;
        const data = await res.json();
        const rates = data[0]?.rates || [];
        const currencyMap: Record<string, { name: string }> = {
          EUR: { name: "Euro" },
          USD: { name: "Dolar" },
          GBP: { name: "Funt" },
          CHF: { name: "Frank" },
        };
        const newData: MarketData[] = [];
        for (const rate of rates) {
          if (currencyMap[rate.code]) {
            const changeVal = (Math.random() * 0.4 - 0.2).toFixed(2);
            const isPositive = parseFloat(changeVal) >= 0;
            newData.push({
              symbol: `${rate.code}/PLN`,
              name: currencyMap[rate.code].name,
              price: rate.mid.toFixed(4),
              change: `${isPositive ? "+" : ""}${(rate.mid * parseFloat(changeVal) / 100).toFixed(4)}`,
              changePercent: `${isPositive ? "+" : ""}${changeVal}%`,
            });
          }
        }
        if (newData.length > 0) setForexData(newData);
      } catch { /* use fallback */ }
    }

    // Fetch crypto data from CoinGecko
    async function fetchCrypto() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano&order=market_cap_desc&sparkline=false&price_change_percentage=24h"
        );
        if (!res.ok) return;
        const data = await res.json();
        const newData: MarketData[] = data.map((coin: {
          symbol: string;
          name: string;
          current_price: number;
          price_change_24h: number;
          price_change_percentage_24h: number;
        }) => ({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price.toLocaleString("en-US", { minimumFractionDigits: 2 }),
          change: `${coin.price_change_24h >= 0 ? "+" : ""}${coin.price_change_24h.toFixed(2)}`,
          changePercent: `${coin.price_change_percentage_24h >= 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%`,
        }));
        if (newData.length > 0) setCryptoData(newData);
      } catch { /* use fallback */ }
    }

    // Simulate stocks data updates
    function updateStocks() {
      const updated = fallbackStocks.map(stock => {
        const changeVal = (Math.random() * 2 - 1).toFixed(2);
        const isPositive = parseFloat(changeVal) >= 0;
        return {
          ...stock,
          change: `${isPositive ? "+" : ""}${changeVal}`,
          changePercent: `${isPositive ? "+" : ""}${changeVal}%`,
        };
      });
      setStocksData(updated);
    }

    fetchForex();
    fetchCrypto();
    updateStocks();

    const interval = setInterval(() => {
      fetchForex();
      fetchCrypto();
      updateStocks();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 21 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Kalendarz ekonomiczny */}
      <div className="bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors duration-300">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-[#0f1115] to-[#0c0d10]">
          <span className="text-base">📅</span>
          <div>
            <h3 className="text-xs font-semibold text-[#f4f4f5] uppercase tracking-[0.1em]">Kalendarz</h3>
            <span className="text-[9px] text-[#71717a]">Dzisiejsze wydarzenia</span>
          </div>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {economicEvents.map((item, i) => (
            <div key={i} className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 hover:bg-white/[0.02] transition-all duration-200 group">
              <div className="w-9 lg:w-10 text-center flex-shrink-0">
                <span className="text-[10px] lg:text-[11px] text-[#f4f4f5] font-mono font-medium">{item.time}</span>
              </div>
              <div className={`w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full flex-shrink-0 ${item.impact === 'high' ? 'bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 'bg-[#fbbf24] shadow-[0_0_6px_rgba(251,191,36,0.4)]'}`} />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] lg:text-[11px] text-[#f4f4f5] block leading-tight group-hover:text-[#c9a962] transition-colors truncate">{item.event}</span>
              </div>
              <span className="text-[8px] lg:text-[9px] text-[#f4f4f5] bg-white/10 px-1 lg:px-1.5 py-0.5 rounded font-medium flex-shrink-0">{item.country}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Waluty */}
      <DataSection title="Kursy walut" icon="💱" data={forexData} />

      {/* Kryptowaluty */}
      <DataSection title="Kryptowaluty" icon="₿" data={cryptoData} />

      {/* Indeksy giełdowe */}
      <DataSection title="Indeksy" icon="📈" data={stocksData} />
    </motion.aside>
  );
}

