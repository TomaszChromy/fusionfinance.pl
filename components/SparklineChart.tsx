"use client";

import { useMemo } from "react";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
  showDot?: boolean;
  className?: string;
}

export default function SparklineChart({
  data,
  width = 80,
  height = 24,
  color = "#c9a962",
  fillColor,
  strokeWidth = 1.5,
  showDot = true,
  className = "",
}: SparklineChartProps) {
  const path = useMemo(() => {
    if (data.length < 2) return "";

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return { x, y };
    });

    const pathData = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      
      // Smooth curve using quadratic bezier
      const prev = points[index - 1];
      const cpX = (prev.x + point.x) / 2;
      return `${acc} Q ${cpX} ${prev.y} ${point.x} ${point.y}`;
    }, "");

    return pathData;
  }, [data, width, height]);

  const fillPath = useMemo(() => {
    if (!fillColor || data.length < 2) return "";
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return { x, y };
    });

    const linePath = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const prev = points[index - 1];
      const cpX = (prev.x + point.x) / 2;
      return `${acc} Q ${cpX} ${prev.y} ${point.x} ${point.y}`;
    }, "");

    return `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  }, [data, width, height, fillColor]);

  const lastPoint = useMemo(() => {
    if (data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;
    const index = data.length - 1;
    
    return {
      x: (index / (data.length - 1)) * (width - padding * 2) + padding,
      y: height - padding - ((data[index] - min) / range) * (height - padding * 2),
    };
  }, [data, width, height]);

  // Determine trend color
  const trendColor = useMemo(() => {
    if (data.length < 2) return color;
    const first = data[0];
    const last = data[data.length - 1];
    if (last > first) return "#22c55e"; // green
    if (last < first) return "#ef4444"; // red
    return color;
  }, [data, color]);

  if (data.length < 2) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-[10px] text-[#71717a]">—</span>
      </div>
    );
  }

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      {/* Fill gradient */}
      {fillColor && (
        <defs>
          <linearGradient id={`sparkline-gradient-${color.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      
      {/* Fill area */}
      {fillColor && (
        <path
          d={fillPath}
          fill={`url(#sparkline-gradient-${color.replace("#", "")})`}
        />
      )}
      
      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={trendColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Last point dot */}
      {showDot && lastPoint && (
        <>
          <circle cx={lastPoint.x} cy={lastPoint.y} r={3} fill={trendColor} />
          <circle cx={lastPoint.x} cy={lastPoint.y} r={5} fill={trendColor} opacity={0.3} />
        </>
      )}
    </svg>
  );
}

// Helper function to generate mock data
export function generateMockData(length: number = 20, trend: "up" | "down" | "neutral" = "neutral"): number[] {
  const data: number[] = [];
  let value = 100;
  
  for (let i = 0; i < length; i++) {
    const random = (Math.random() - 0.5) * 4;
    const trendFactor = trend === "up" ? 0.3 : trend === "down" ? -0.3 : 0;
    value += random + trendFactor;
    data.push(parseFloat(value.toFixed(2)));
  }
  
  return data;
}

