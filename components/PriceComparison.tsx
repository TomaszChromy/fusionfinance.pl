"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ExchangePrice {
  exchange: string;
  price: number;
  volume24h?: number;
  fee?: number;
}

interface ComparisonData {
  asset: string;
  prices: ExchangePrice[];
}

const MOCK_DATA: ComparisonData = {
  asset: "BTC/USDT",
  prices: [
    { exchange: "Binance", price: 101523.45, volume24h: 2345000000, fee: 0.1 },
    { exchange: "Coinbase", price: 101567.89, volume24h: 890000000, fee: 0.5 },
    { exchange: "Kraken", price: 101498.12, volume24h: 456000000, fee: 0.26 },
    { exchange: "Bitfinex", price: 101534.56, volume24h: 234000000, fee: 0.2 },
    { exchange: "OKX", price: 101512.34, volume24h: 1890000000, fee: 0.08 },
  ],
};

interface PriceComparisonProps {
  data?: ComparisonData;
  variant?: "default" | "compact" | "table";
  className?: string;
}

export default function PriceComparison({
  data = MOCK_DATA,
  variant = "default",
  className = "",
}: PriceComparisonProps) {
  const { bestPrice, worstPrice, spread, spreadPercent } = useMemo(() => {
    const prices = data.prices.map((p) => p.price);
    const best = Math.min(...prices);
    const worst = Math.max(...prices);
    const diff = worst - best;
    const pct = (diff / best) * 100;
    return { bestPrice: best, worstPrice: worst, spread: diff, spreadPercent: pct };
  }, [data.prices]);

  if (variant === "compact") {
    const sortedPrices = [...data.prices].sort((a, b) => a.price - b.price);
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#f4f4f5]">{data.asset}</span>
          <span className="text-[10px] text-[#71717a]">Spread: {spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[10px] text-[#4ade80]">Najlepsza</p>
            <p className="text-sm font-medium text-[#f4f4f5]">{sortedPrices[0].exchange}: ${sortedPrices[0].price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#f87171]">Najgorsza</p>
            <p className="text-sm font-medium text-[#f4f4f5]">{sortedPrices[sortedPrices.length - 1].exchange}: ${sortedPrices[sortedPrices.length - 1].price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
            <span>🔄</span>
            Porównanie cen - {data.asset}
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-white/[0.02]">
            <tr className="text-[10px] text-[#52525b] uppercase tracking-wider">
              <th className="px-4 py-2 text-left">Giełda</th>
              <th className="px-4 py-2 text-right">Cena</th>
              <th className="px-4 py-2 text-right">Wolumen 24h</th>
              <th className="px-4 py-2 text-right">Prowizja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.prices.sort((a, b) => a.price - b.price).map((item, index) => (
              <tr key={item.exchange} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-sm text-[#f4f4f5]">
                  {index === 0 && <span className="text-[#4ade80] mr-1">★</span>}
                  {item.exchange}
                </td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${item.price === bestPrice ? "text-[#4ade80]" : item.price === worstPrice ? "text-[#f87171]" : "text-[#f4f4f5]"}`}>
                  ${item.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-right text-[#71717a]">
                  ${(item.volume24h! / 1e9).toFixed(2)}B
                </td>
                <td className="px-4 py-3 text-xs text-right text-[#71717a]">{item.fee}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>🔄</span>
          Porównanie cen
        </h3>
        <span className="text-xs text-[#c9a962] font-medium">{data.asset}</span>
      </div>

      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between text-[10px] text-[#71717a] mb-2">
          <span>Spread między giełdami</span>
          <span className="text-[#fbbf24]">{spreadPercent.toFixed(3)}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(spreadPercent * 100, 100)}%` }}
            className="h-full bg-gradient-to-r from-[#4ade80] via-[#fbbf24] to-[#f87171] rounded-full"
          />
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {data.prices.sort((a, b) => a.price - b.price).map((item, index) => (
          <motion.div
            key={item.exchange}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              {index === 0 && <span className="text-lg">🥇</span>}
              {index === 1 && <span className="text-lg">🥈</span>}
              {index === 2 && <span className="text-lg">🥉</span>}
              {index > 2 && <span className="w-6 text-center text-xs text-[#52525b]">{index + 1}</span>}
              <span className="text-sm font-medium text-[#f4f4f5]">{item.exchange}</span>
            </div>
            <span className={`text-sm font-bold ${item.price === bestPrice ? "text-[#4ade80]" : item.price === worstPrice ? "text-[#f87171]" : "text-[#f4f4f5]"}`}>
              ${item.price.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

