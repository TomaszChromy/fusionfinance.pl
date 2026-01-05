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
        // Proxy API (avoids CORS issues)
        const response = await fetch("/api/crypto?ids=bitcoin,ethereum,solana,binancecoin,ripple");
        if (!response.ok) throw new Error("Crypto API error");

        const json = await response.json();
        if (!json.success || !json.data) throw new Error("Invalid response");

        const newData: CryptoData[] = json.data.map((coin: {
          name: string;
          symbol: string;
          price: number;
          change24h: number;
        }) => ({
          name: coin.name,
          symbol: coin.symbol,
          price: `$${coin.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${coin.change24h >= 0 ? "+" : ""}${coin.change24h.toFixed(2)}%`,
          isPositive: coin.change24h >= 0,
        }));

        if (newData.length > 0) setCryptoData(newData);
      } catch {
        // Użyj fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Odśwież co 60 sekund
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
