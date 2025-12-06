"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface HeatMapItem {
  id: string;
  symbol: string;
  name: string;
  change: number;
  value?: number;
  size?: number; // for treemap sizing
}

const MOCK_DATA: HeatMapItem[] = [
  { id: "1", symbol: "PKO", name: "PKO BP", change: 2.45, value: 45.82, size: 50 },
  { id: "2", symbol: "PZU", name: "PZU SA", change: -1.23, value: 42.10, size: 45 },
  { id: "3", symbol: "CDR", name: "CD Projekt", change: 5.67, value: 145.30, size: 40 },
  { id: "4", symbol: "PEO", name: "Pekao SA", change: -0.45, value: 125.60, size: 38 },
  { id: "5", symbol: "DNP", name: "Dino Polska", change: 3.21, value: 385.20, size: 35 },
  { id: "6", symbol: "KGH", name: "KGHM", change: -2.34, value: 145.80, size: 42 },
  { id: "7", symbol: "OPL", name: "Orange PL", change: 0.89, value: 8.25, size: 25 },
  { id: "8", symbol: "LPP", name: "LPP SA", change: 4.12, value: 12450, size: 48 },
  { id: "9", symbol: "SPL", name: "Santander PL", change: -0.78, value: 380.50, size: 36 },
  { id: "10", symbol: "ALE", name: "Allegro", change: 1.56, value: 34.20, size: 44 },
  { id: "11", symbol: "CPS", name: "Cyfrowy PL", change: -3.12, value: 24.80, size: 30 },
  { id: "12", symbol: "JSW", name: "JSW SA", change: -4.56, value: 28.40, size: 28 },
];

const getColorByChange = (change: number): string => {
  if (change >= 4) return "bg-[#22c55e]";
  if (change >= 2) return "bg-[#4ade80]";
  if (change >= 0.5) return "bg-[#86efac]";
  if (change >= 0) return "bg-[#bbf7d0]";
  if (change >= -0.5) return "bg-[#fecaca]";
  if (change >= -2) return "bg-[#f87171]";
  if (change >= -4) return "bg-[#ef4444]";
  return "bg-[#dc2626]";
};

const getTextColorByChange = (change: number): string => {
  const abs = Math.abs(change);
  if (abs >= 2) return "text-white";
  return "text-[#18181b]";
};

interface HeatMapProps {
  data?: HeatMapItem[];
  title?: string;
  className?: string;
}

export default function HeatMap({
  data = MOCK_DATA,
  title = "Mapa ciepła WIG20",
  className = "",
}: HeatMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>🗺️</span>
          {title}
        </h3>
        <div className="flex items-center gap-1 text-[10px]">
          <span className="px-2 py-0.5 bg-[#ef4444] text-white rounded">-4%</span>
          <span className="px-2 py-0.5 bg-[#fecaca] text-[#18181b] rounded">0</span>
          <span className="px-2 py-0.5 bg-[#22c55e] text-white rounded">+4%</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="p-4">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-1">
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`relative aspect-square rounded-lg ${getColorByChange(item.change)} ${getTextColorByChange(item.change)} cursor-pointer transition-transform hover:scale-105 hover:z-10 flex flex-col items-center justify-center p-1`}
            >
              <span className="text-xs font-bold leading-none">{item.symbol}</span>
              <span className="text-[10px] font-medium mt-0.5">
                {item.change >= 0 ? "+" : ""}{item.change.toFixed(1)}%
              </span>

              {/* Tooltip */}
              {hoveredId === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 shadow-xl z-20 whitespace-nowrap"
                >
                  <p className="text-xs font-medium text-[#f4f4f5]">{item.name}</p>
                  <p className="text-[10px] text-[#a1a1aa]">{item.value?.toLocaleString("pl-PL")} PLN</p>
                  <p className={`text-[10px] font-medium ${item.change >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#18181b]" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-[10px] text-[#52525b]">
          <span>📈 Wzrosty: {data.filter((d) => d.change > 0).length}</span>
          <span>📉 Spadki: {data.filter((d) => d.change < 0).length}</span>
          <span>⚖️ Bez zmian: {data.filter((d) => d.change === 0).length}</span>
        </div>
      </div>
    </div>
  );
}

// Compact heatmap strip
export function HeatMapStrip({ data = MOCK_DATA.slice(0, 8), className = "" }: { data?: HeatMapItem[]; className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {data.map((item) => (
        <div
          key={item.id}
          className={`px-2 py-1 rounded text-[10px] font-medium ${getColorByChange(item.change)} ${getTextColorByChange(item.change)}`}
          title={`${item.name}: ${item.change >= 0 ? "+" : ""}${item.change.toFixed(2)}%`}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );
}

