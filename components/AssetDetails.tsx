"use client";

import { motion } from "framer-motion";
import Sparkline from "./Sparkline";

interface AssetDetailsProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high24h?: number;
  low24h?: number;
  volume?: number;
  marketCap?: number;
  sparklineData?: number[];
  className?: string;
}

export default function AssetDetails({
  symbol,
  name,
  price,
  change,
  changePercent,
  high24h,
  low24h,
  volume,
  marketCap,
  sparklineData = [100, 102, 98, 105, 103, 108, 106, 110],
  className = "",
}: AssetDetailsProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-[#f4f4f5]">{symbol}</span>
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                isPositive ? "bg-[#4ade80]/20 text-[#4ade80]" : "bg-[#f87171]/20 text-[#f87171]"
              }`}>
                {isPositive ? "↑" : "↓"} {Math.abs(changePercent).toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-[#71717a]">{name}</p>
          </div>
          <Sparkline data={sparklineData} width={80} height={32} />
        </div>
      </div>

      {/* Price */}
      <div className="p-4 border-b border-white/5">
        <p className="text-2xl font-bold text-[#f4f4f5]">
          {price.toLocaleString("pl-PL", { minimumFractionDigits: 2 })}
        </p>
        <p className={`text-sm ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {isPositive ? "+" : ""}{change.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
        </p>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {high24h !== undefined && (
          <div>
            <p className="text-[10px] text-[#52525b] uppercase tracking-wider mb-0.5">Max 24h</p>
            <p className="text-sm font-medium text-[#4ade80]">{high24h.toLocaleString("pl-PL")}</p>
          </div>
        )}
        {low24h !== undefined && (
          <div>
            <p className="text-[10px] text-[#52525b] uppercase tracking-wider mb-0.5">Min 24h</p>
            <p className="text-sm font-medium text-[#f87171]">{low24h.toLocaleString("pl-PL")}</p>
          </div>
        )}
        {volume !== undefined && (
          <div>
            <p className="text-[10px] text-[#52525b] uppercase tracking-wider mb-0.5">Wolumen 24h</p>
            <p className="text-sm font-medium text-[#f4f4f5]">{(volume / 1e6).toFixed(2)}M</p>
          </div>
        )}
        {marketCap !== undefined && (
          <div>
            <p className="text-[10px] text-[#52525b] uppercase tracking-wider mb-0.5">Kap. rynk.</p>
            <p className="text-sm font-medium text-[#f4f4f5]">{(marketCap / 1e9).toFixed(2)}B</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/5 flex gap-2">
        <button
          type="button"
          className="flex-1 py-2 text-xs font-medium bg-[#4ade80]/20 text-[#4ade80] rounded-lg hover:bg-[#4ade80]/30 transition-colors"
        >
          📈 Kup
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-xs font-medium bg-[#f87171]/20 text-[#f87171] rounded-lg hover:bg-[#f87171]/30 transition-colors"
        >
          📉 Sprzedaj
        </button>
        <button
          type="button"
          className="py-2 px-3 text-xs font-medium bg-white/5 text-[#a1a1aa] rounded-lg hover:bg-white/10 transition-colors"
        >
          🔔
        </button>
      </div>
    </motion.div>
  );
}

// Compact variant
export function AssetDetailsCompact({
  symbol,
  name,
  price,
  changePercent,
  className = "",
}: Pick<AssetDetailsProps, "symbol" | "name" | "price" | "changePercent" | "className">) {
  const isPositive = changePercent >= 0;
  return (
    <div className={`flex items-center justify-between p-3 bg-[#0c0d10] border border-white/5 rounded-lg ${className}`}>
      <div>
        <span className="text-sm font-medium text-[#f4f4f5]">{symbol}</span>
        <span className="text-xs text-[#52525b] ml-2">{name}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-[#f4f4f5]">{price.toLocaleString("pl-PL")}</p>
        <p className={`text-xs ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

