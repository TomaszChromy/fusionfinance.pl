"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface VolumeData {
  time: string;
  volume: number;
  isBuy?: boolean;
}

const MOCK_DATA: VolumeData[] = [
  { time: "09:00", volume: 1250000, isBuy: true },
  { time: "10:00", volume: 890000, isBuy: false },
  { time: "11:00", volume: 1450000, isBuy: true },
  { time: "12:00", volume: 780000, isBuy: false },
  { time: "13:00", volume: 1680000, isBuy: true },
  { time: "14:00", volume: 920000, isBuy: true },
  { time: "15:00", volume: 1120000, isBuy: false },
  { time: "16:00", volume: 1890000, isBuy: true },
  { time: "17:00", volume: 1340000, isBuy: true },
];

interface VolumeChartProps {
  data?: VolumeData[];
  title?: string;
  height?: number;
  showBuySell?: boolean;
  className?: string;
}

export default function VolumeChart({
  data = MOCK_DATA,
  title = "Wolumen handlu",
  height = 150,
  showBuySell = true,
  className = "",
}: VolumeChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { maxVolume, totalVolume, buyVolume, sellVolume } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.volume));
    const total = data.reduce((sum, d) => sum + d.volume, 0);
    const buy = data.filter((d) => d.isBuy).reduce((sum, d) => sum + d.volume, 0);
    const sell = total - buy;
    return { maxVolume: max, totalVolume: total, buyVolume: buy, sellVolume: sell };
  }, [data]);

  const barWidth = 100 / data.length - 1;

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
            <span>📊</span>
            {title}
          </h3>
          <span className="text-xs text-[#71717a]">
            {(totalVolume / 1e6).toFixed(2)}M całkowity
          </span>
        </div>

        {/* Buy/Sell ratio */}
        {showBuySell && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-[#4ade80]">Kupno {((buyVolume / totalVolume) * 100).toFixed(1)}%</span>
              <span className="text-[#f87171]">Sprzedaż {((sellVolume / totalVolume) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-[#f87171] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(buyVolume / totalVolume) * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-[#4ade80] rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="relative" style={{ height }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => (
            <div
              key={ratio}
              className="absolute left-0 right-0 border-t border-white/5"
              style={{ top: `${ratio * 100}%` }}
            />
          ))}

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between gap-1">
            {data.map((item, index) => {
              const barHeight = (item.volume / maxVolume) * 100;
              return (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative rounded-t cursor-pointer transition-opacity ${
                    showBuySell
                      ? item.isBuy
                        ? "bg-[#4ade80]"
                        : "bg-[#f87171]"
                      : "bg-[#c9a962]"
                  } ${hoveredIndex !== null && hoveredIndex !== index ? "opacity-50" : ""}`}
                  style={{ width: `${barWidth}%` }}
                >
                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#18181b] border border-white/10 rounded-lg px-2 py-1 text-[10px] whitespace-nowrap z-10"
                    >
                      <p className="text-[#f4f4f5] font-medium">{(item.volume / 1e6).toFixed(2)}M</p>
                      <p className="text-[#52525b]">{item.time}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.filter((_, i) => i % 2 === 0).map((item, index) => (
            <span key={index} className="text-[9px] text-[#52525b]">
              {item.time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

