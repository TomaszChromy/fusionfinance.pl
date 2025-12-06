"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  footer?: ReactNode;
  variant?: "default" | "gradient" | "outline";
  className?: string;
}

export default function DataCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  trend,
  footer,
  variant = "default",
  className = "",
}: DataCardProps) {
  const trendColors = {
    up: "text-[#4ade80]",
    down: "text-[#f87171]",
    neutral: "text-[#71717a]",
  };

  const trendBg = {
    up: "bg-[#4ade80]/10",
    down: "bg-[#f87171]/10",
    neutral: "bg-white/5",
  };

  const variantStyles = {
    default: "bg-[#0c0d10] border border-white/5",
    gradient: "bg-gradient-to-br from-[#0c0d10] to-[#08090c] border border-[#c9a962]/20",
    outline: "bg-transparent border-2 border-white/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${variantStyles[variant]} rounded-xl p-5 hover:border-[#c9a962]/30 transition-colors ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-[#71717a] uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-serif font-medium text-[#f4f4f5]">
            {typeof value === "number" ? value.toLocaleString("pl-PL") : value}
          </p>
          {subtitle && <p className="text-xs text-[#52525b] mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center text-[#c9a962]">
            {icon}
          </div>
        )}
      </div>

      {(change !== undefined || trend) && (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${trendBg[trend || "neutral"]}`}>
          {trend && (
            <span className={trendColors[trend]}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
          )}
          {change !== undefined && (
            <span className={`text-xs font-medium ${trendColors[trend || "neutral"]}`}>
              {change > 0 ? "+" : ""}{change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-xs text-[#71717a]">{changeLabel}</span>
          )}
        </div>
      )}

      {footer && <div className="mt-4 pt-3 border-t border-white/5">{footer}</div>}
    </motion.div>
  );
}

// Macro Data Card - for economic indicators
export function MacroDataCard({
  indicator,
  value,
  previousValue,
  forecast,
  date,
  importance = "medium",
  className = "",
}: {
  indicator: string;
  value: string | number;
  previousValue?: string | number;
  forecast?: string | number;
  date?: string;
  importance?: "low" | "medium" | "high";
  className?: string;
}) {
  const importanceColors = {
    low: "border-l-[#71717a]",
    medium: "border-l-[#fbbf24]",
    high: "border-l-[#f87171]",
  };

  return (
    <div className={`bg-[#0c0d10] border border-white/5 ${importanceColors[importance]} border-l-4 rounded-xl p-4 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-[#f4f4f5]">{indicator}</h4>
        {date && <span className="text-[10px] text-[#52525b]">{date}</span>}
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] text-[#71717a] uppercase mb-1">Aktualnie</p>
          <p className="text-lg font-bold text-[#f4f4f5]">{value}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#71717a] uppercase mb-1">Poprzednio</p>
          <p className="text-lg font-medium text-[#a1a1aa]">{previousValue ?? "-"}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#71717a] uppercase mb-1">Prognoza</p>
          <p className="text-lg font-medium text-[#a1a1aa]">{forecast ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}

// Stats Overview Card
export function StatsOverviewCard({
  title,
  stats,
  className = "",
}: {
  title: string;
  stats: Array<{ label: string; value: string | number; change?: number }>;
  className?: string;
}) {
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-5 ${className}`}>
      <h3 className="text-sm font-medium text-[#c9a962] mb-4">{title}</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-xs text-[#71717a]">{stat.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#f4f4f5]">
                {typeof stat.value === "number" ? stat.value.toLocaleString("pl-PL") : stat.value}
              </span>
              {stat.change !== undefined && (
                <span className={`text-xs ${stat.change >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                  {stat.change >= 0 ? "+" : ""}{stat.change}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

