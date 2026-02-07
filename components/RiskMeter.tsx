"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

interface RiskMeterProps {
  value: number; // 0-100
  label?: string;
  variant?: "default" | "compact" | "gauge" | "horizontal";
  showLabel?: boolean;
  className?: string;
}

function getRiskLevel(value: number): { label: string; color: string; bg: string } {
  if (value <= 20) return { label: "Bardzo niskie", color: "text-[#22c55e]", bg: "bg-[#22c55e]" };
  if (value <= 40) return { label: "Niskie", color: "text-[#4ade80]", bg: "bg-[#4ade80]" };
  if (value <= 60) return { label: "Umiarkowane", color: "text-[#fbbf24]", bg: "bg-[#fbbf24]" };
  if (value <= 80) return { label: "Wysokie", color: "text-[#f87171]", bg: "bg-[#f87171]" };
  return { label: "Bardzo wysokie", color: "text-[#ef4444]", bg: "bg-[#ef4444]" };
}

export default function RiskMeter({
  value,
  label = "Poziom ryzyka",
  variant = "default",
  showLabel = true,
  className = "",
}: RiskMeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const risk = useMemo(() => getRiskLevel(value), [value]);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [value]);

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            className={`h-full ${risk.bg} rounded-full`}
          />
        </div>
        <span className={`text-xs font-medium ${risk.color}`}>{displayValue}%</span>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#71717a]">{label}</span>
          <span className={`text-xs font-medium ${risk.color}`}>{risk.label}</span>
        </div>
        <div className="relative h-2 bg-gradient-to-r from-[#22c55e] via-[#fbbf24] to-[#ef4444] rounded-full">
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${value}%` }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#08090c] shadow-lg"
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-[#52525b]">
          <span>Niskie</span>
          <span>Wysokie</span>
        </div>
      </div>
    );
  }

  if (variant === "gauge") {
    const angle = (value / 100) * 180 - 90;
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        {showLabel && (
          <h3 className="text-sm font-medium text-[#f4f4f5] text-center mb-4 flex items-center justify-center gap-2">
            <span>⚠️</span>
            {label}
          </h3>
        )}
        <div className="relative w-32 h-16 mx-auto">
          {/* Gauge background */}
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#riskGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          {/* Needle */}
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1, type: "spring" }}
            className="absolute bottom-0 left-1/2 origin-bottom -translate-x-1/2"
            style={{ width: 2, height: 36 }}
          >
            <div className="w-full h-full bg-white rounded-full" />
          </motion.div>
          {/* Center dot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-[#0c0d10] border-2 border-white rounded-full" />
        </div>
        <div className="text-center mt-4">
          <span className={`text-2xl font-bold ${risk.color}`}>{displayValue}%</span>
          <p className={`text-xs ${risk.color} mt-1`}>{risk.label}</p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
      {showLabel && (
        <h3 className="text-sm font-medium text-[#f4f4f5] mb-3 flex items-center gap-2">
          <span>⚠️</span>
          {label}
        </h3>
      )}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#27272a" strokeWidth="3" />
            <motion.circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke={risk.bg.replace("bg-", "")}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${value} 100`}
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${value} 100` }}
              transition={{ duration: 1 }}
              className={risk.bg.replace("bg-", "stroke-")}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${risk.color}`}>{displayValue}%</span>
          </div>
        </div>
        <div>
          <p className={`text-base font-medium ${risk.color}`}>{risk.label}</p>
          <p className="text-xs text-[#71717a] mt-0.5">Ocena ryzyka</p>
        </div>
      </div>
    </div>
  );
}
