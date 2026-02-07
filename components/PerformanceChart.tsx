"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface DataPoint {
  date: string;
  value: number;
}

interface PerformanceChartProps {
  data?: DataPoint[];
  title?: string;
  showLegend?: boolean;
  height?: number;
  className?: string;
}

const MOCK_DATA: DataPoint[] = [
  { date: "Sty", value: 10000 },
  { date: "Lut", value: 10250 },
  { date: "Mar", value: 10180 },
  { date: "Kwi", value: 10650 },
  { date: "Maj", value: 11200 },
  { date: "Cze", value: 10900 },
  { date: "Lip", value: 11450 },
  { date: "Sie", value: 11800 },
  { date: "Wrz", value: 12100 },
  { date: "Paź", value: 11950 },
  { date: "Lis", value: 12400 },
  { date: "Gru", value: 12850 },
];

const PERIODS = [
  { id: "1M", label: "1M" },
  { id: "3M", label: "3M" },
  { id: "6M", label: "6M" },
  { id: "1Y", label: "1R" },
  { id: "ALL", label: "Max" },
];

export default function PerformanceChart({
  data = MOCK_DATA,
  title = "Wydajność portfela",
  height = 200,
  className = "",
}: PerformanceChartProps) {
  const [period, setPeriod] = useState("1Y");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { path, areaPath, points, totalChange, percentChange } = useMemo(() => {
    const values = data.map((d) => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    const padding = 20;
    const width = 100;

    const pts = data.map((d, i) => ({
      x: padding + (i / (data.length - 1)) * (width - padding * 2),
      y: padding + (1 - (d.value - minVal) / range) * (height - padding * 2),
      value: d.value,
      date: d.date,
    }));

    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      pathD += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const areaD = pathD + ` L ${pts[pts.length - 1].x} ${height - padding} L ${pts[0].x} ${height - padding} Z`;

    const first = data[0].value;
    const last = data[data.length - 1].value;
    const change = last - first;
    const pctChange = ((last - first) / first) * 100;

    return { min: minVal, max: maxVal, path: pathD, areaPath: areaD, points: pts, totalChange: change, percentChange: pctChange };
  }, [data, height]);

  const isPositive = percentChange >= 0;

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
            <span>📈</span>
            {title}
          </h3>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`px-2 py-0.5 text-[10px] rounded transition-all ${
                  period === p.id
                    ? "bg-[#c9a962]/20 text-[#c9a962]"
                    : "text-[#71717a] hover:text-[#a1a1aa]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-[#f4f4f5]">
            {data[data.length - 1].value.toLocaleString("pl-PL")} PLN
          </span>
          <span className={`text-sm font-medium ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
            {isPositive ? "+" : ""}{totalChange.toLocaleString("pl-PL")} ({isPositive ? "+" : ""}{percentChange.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 relative">
        <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1="20"
              y1={20 + ratio * (height - 40)}
              x2="80"
              y2={20 + ratio * (height - 40)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.2"
            />
          ))}

          {/* Gradient */}
          <defs>
            <linearGradient id="perf-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? "#4ade80" : "#f87171"} stopOpacity={0.3} />
              <stop offset="100%" stopColor={isPositive ? "#4ade80" : "#f87171"} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Area */}
          <motion.path d={areaPath} fill="url(#perf-gradient)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />

          {/* Line */}
          <motion.path
            d={path}
            fill="none"
            stroke={isPositive ? "#4ade80" : "#f87171"}
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 1.5 : 0.8}
              fill={isPositive ? "#4ade80" : "#f87171"}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 right-4 bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-xs"
          >
            <p className="text-[#71717a]">{points[hoveredIndex].date}</p>
            <p className="font-medium text-[#f4f4f5]">{points[hoveredIndex].value.toLocaleString("pl-PL")} PLN</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
