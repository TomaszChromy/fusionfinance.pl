"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CryptoData {
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

// Fallback data
const fallbackData: CryptoData[] = [
  { name: "Bitcoin", symbol: "BTC", price: "$97,245", change: "+2.34%", isPositive: true },
  { name: "Ethereum", symbol: "ETH", price: "$3,456", change: "+1.87%", isPositive: true },
  { name: "Solana", symbol: "SOL", price: "$234.56", change: "+5.23%", isPositive: true },
  { name: "BNB", symbol: "BNB", price: "$645.32", change: "-0.45%", isPositive: false },
  { name: "XRP", symbol: "XRP", price: "$2.34", change: "+3.12%", isPositive: true },
];

export default function CryptoSection() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCryptoData() {
      try {
        // CoinGecko API (darmowe, bez klucza)
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,ripple&order=market_cap_desc&sparkline=false&price_change_percentage=24h"
        );
        if (!response.ok) throw new Error("CoinGecko API error");

        const data = await response.json();

        const newData: CryptoData[] = data.map((coin: {
          name: string;
          symbol: string;
          current_price: number;
          price_change_percentage_24h: number;
        }) => ({
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: `$${coin.current_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${coin.price_change_percentage_24h >= 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%`,
          isPositive: coin.price_change_percentage_24h >= 0,
        }));

        if (newData.length > 0) setCryptoData(newData);
      } catch {
        // Użyj fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000); // Odśwież co 30 sekund
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]"
    >
      {loading ? (
        <div className="space-y-[13px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between animate-pulse">
              <div className="h-4 bg-white/5 rounded w-24" />
              <div className="h-4 bg-white/5 rounded w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {cryptoData.map((coin, index) => (
            <motion.div
              key={coin.symbol}
              initial={{ opacity: 0, x: -5 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-center justify-between py-[13px] first:pt-0 last:pb-0 hover:bg-[#c9a962]/5 -mx-[8px] px-[8px] rounded transition-colors duration-300"
            >
              <div className="flex items-center gap-[8px]">
                <span className="text-[13px] text-[#f4f4f5] font-medium">{coin.name}</span>
                <span className="text-[10px] text-[#71717a] uppercase">{coin.symbol}</span>
              </div>
              <div className="flex items-center gap-[13px]">
                <span className="text-[13px] text-[#f4f4f5] font-mono">{coin.price}</span>
                <span
                  className={`text-[11px] font-medium w-[55px] text-right ${
                    coin.isPositive ? "text-[#4ade80]" : "text-[#f87171]"
                  }`}
                >
                  {coin.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
