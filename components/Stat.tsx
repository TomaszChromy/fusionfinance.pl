"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function Stat({ 
  label, 
  value, 
  change, 
  icon, 
  trend,
  className = "" 
}: StatProps) {
  const trendColor = trend === "up" 
    ? "text-[#4ade80]" 
    : trend === "down" 
    ? "text-[#f87171]" 
    : "text-[#71717a]";
  
  const trendIcon = trend === "up" 
    ? "↑" 
    : trend === "down" 
    ? "↓" 
    : "→";

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 hover:border-[#c9a962]/20 transition-colors ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#71717a] uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-serif font-medium text-[#f4f4f5]">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${trendColor}`}>
              <span>{trendIcon}</span>
              <span>{change > 0 ? "+" : ""}{change}%</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center text-[#c9a962]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Stats Grid
interface StatsGridProps {
  stats: StatProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ stats, columns = 4, className = "" }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Stat {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

// Mini Stat (compact version)
export function MiniStat({ 
  label, 
  value, 
  change,
  className = "" 
}: { 
  label: string; 
  value: string | number; 
  change?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${className}`}>
      <span className="text-xs text-[#71717a]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#f4f4f5]">{value}</span>
        {change !== undefined && (
          <span className={`text-xs ${change >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
    </div>
  );
}

// Stat Card with sparkline placeholder
export function StatCard({ 
  label, 
  value, 
  change,
  trend,
  sparkline,
  className = "" 
}: StatProps & { sparkline?: ReactNode }) {
  const trendColor = trend === "up" 
    ? "text-[#4ade80]" 
    : trend === "down" 
    ? "text-[#f87171]" 
    : "text-[#71717a]";

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-colors ${className}`}>
      <p className="text-xs text-[#71717a] uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-serif font-medium text-[#f4f4f5]">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${trendColor}`}>
              {change > 0 ? "+" : ""}{change}%
            </p>
          )}
        </div>
        {sparkline && (
          <div className="w-24 h-12">
            {sparkline}
          </div>
        )}
      </div>
    </div>
  );
}

