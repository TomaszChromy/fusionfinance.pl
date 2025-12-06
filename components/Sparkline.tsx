"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: "green" | "red" | "gold" | "blue" | "auto";
  showDots?: boolean;
  showArea?: boolean;
  strokeWidth?: number;
  className?: string;
}

const COLORS = {
  green: { stroke: "#4ade80", fill: "#4ade80" },
  red: { stroke: "#f87171", fill: "#f87171" },
  gold: { stroke: "#c9a962", fill: "#c9a962" },
  blue: { stroke: "#60a5fa", fill: "#60a5fa" },
};

export default function Sparkline({
  data,
  width = 100,
  height = 30,
  color = "auto",
  showDots = false,
  showArea = true,
  strokeWidth = 1.5,
  className = "",
}: SparklineProps) {
  const { path, areaPath, points, actualColor } = useMemo(() => {
    if (data.length < 2) return { path: "", areaPath: "", points: [], actualColor: COLORS.gold };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;

    const xStep = (width - padding * 2) / (data.length - 1);

    const pts = data.map((value, index) => ({
      x: padding + index * xStep,
      y: padding + (1 - (value - min) / range) * (height - padding * 2),
    }));

    // Create smooth curve path
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Area path
    const area = d + ` L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

    // Determine color based on trend
    let autoColor = COLORS.gold;
    if (color === "auto") {
      autoColor = data[data.length - 1] >= data[0] ? COLORS.green : COLORS.red;
    } else {
      autoColor = COLORS[color];
    }

    return { path: d, areaPath: area, points: pts, actualColor: autoColor };
  }, [data, width, height, color]);

  if (data.length < 2) {
    return <div className={`w-[${width}px] h-[${height}px] ${className}`} />;
  }

  return (
    <svg width={width} height={height} className={className}>
      {/* Gradient */}
      <defs>
        <linearGradient id={`sparkline-gradient-${actualColor.stroke}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={actualColor.fill} stopOpacity={0.3} />
          <stop offset="100%" stopColor={actualColor.fill} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Area */}
      {showArea && (
        <motion.path
          d={areaPath}
          fill={`url(#sparkline-gradient-${actualColor.stroke})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Line */}
      <motion.path
        d={path}
        fill="none"
        stroke={actualColor.stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Dots */}
      {showDots &&
        points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={2}
            fill={actualColor.stroke}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05 * index }}
          />
        ))}

      {/* Last point highlight */}
      {points.length > 0 && (
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={3}
          fill={actualColor.stroke}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
        />
      )}
    </svg>
  );
}

// Sparkline with value display
export function SparklineWithValue({
  data,
  value,
  change,
  label,
  className = "",
}: {
  data: number[];
  value: string;
  change: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 min-w-0">
        {label && <p className="text-xs text-[#52525b] mb-0.5">{label}</p>}
        <p className="text-sm font-medium text-[#f4f4f5]">{value}</p>
        <p className={`text-xs ${change >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
        </p>
      </div>
      <Sparkline data={data} width={60} height={24} />
    </div>
  );
}

