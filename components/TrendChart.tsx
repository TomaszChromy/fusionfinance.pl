"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface TrendChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: "auto" | "green" | "red" | "gold" | "blue";
  showDots?: boolean;
  showArea?: boolean;
  animated?: boolean;
  className?: string;
}

export default function TrendChart({
  data,
  width = 100,
  height = 40,
  color = "auto",
  showDots = false,
  showArea = true,
  animated = true,
  className = "",
}: TrendChartProps) {
  const { path, areaPath, points, trend } = useMemo(() => {
    if (data.length < 2) return { path: "", areaPath: "", points: [], trend: "neutral" as const };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 4;

    const normalizedData = data.map((value, index) => ({
      x: padding + (index / (data.length - 1)) * (width - padding * 2),
      y: padding + (1 - (value - min) / range) * (height - padding * 2),
    }));

    const pathD = normalizedData
      .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const areaD = `${pathD} L ${normalizedData[normalizedData.length - 1].x} ${height} L ${normalizedData[0].x} ${height} Z`;

    const trend = data[data.length - 1] >= data[0] ? "up" : "down";

    return { path: pathD, areaPath: areaD, points: normalizedData, trend };
  }, [data, width, height]);

  const colors = {
    auto: trend === "up" ? "#4ade80" : "#f87171",
    green: "#4ade80",
    red: "#f87171",
    gold: "#c9a962",
    blue: "#60a5fa",
  };

  const strokeColor = colors[color];

  if (data.length < 2) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-[10px] text-[#52525b]">Brak danych</span>
      </div>
    );
  }

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <linearGradient id={`gradient-${strokeColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {showArea && (
        <motion.path
          d={areaPath}
          fill={`url(#gradient-${strokeColor})`}
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5 }}
        />
      )}

      <motion.path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animated ? { pathLength: 0 } : undefined}
        animate={animated ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {showDots && points.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={3}
          fill={strokeColor}
          initial={animated ? { scale: 0 } : undefined}
          animate={animated ? { scale: 1 } : undefined}
          transition={{ delay: i * 0.1, duration: 0.2 }}
        />
      ))}
    </svg>
  );
}

// Sparkline with value
export function SparklineWithValue({
  data,
  value,
  change,
  label,
  className = "",
}: {
  data: number[];
  value: string | number;
  change?: number;
  label?: string;
  className?: string;
}) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TrendChart data={data} width={60} height={24} />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#f4f4f5]">{value}</span>
          {change !== undefined && (
            <span className={`text-xs ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
              {isPositive ? "+" : ""}{change}%
            </span>
          )}
        </div>
        {label && <p className="text-[10px] text-[#52525b]">{label}</p>}
      </div>
    </div>
  );
}

// Mini Chart Card
export function MiniChartCard({
  title,
  value,
  change,
  data,
  className = "",
}: {
  title: string;
  value: string | number;
  change: number;
  data: number[];
  className?: string;
}) {
  const isPositive = change >= 0;

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-[#71717a] mb-1">{title}</p>
          <p className="text-xl font-bold text-[#f4f4f5]">{value}</p>
        </div>
        <div className={`px-2 py-1 rounded-lg ${isPositive ? "bg-[#4ade80]/10" : "bg-[#f87171]/10"}`}>
          <span className={`text-xs font-medium ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
            {isPositive ? "+" : ""}{change}%
          </span>
        </div>
      </div>
      <TrendChart data={data} width={140} height={40} showArea />
    </div>
  );
}

