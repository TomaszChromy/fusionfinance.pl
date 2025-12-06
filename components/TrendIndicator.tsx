"use client";

import { motion } from "framer-motion";

type TrendDirection = "up" | "down" | "neutral";
type TrendStrength = "strong" | "moderate" | "weak";

interface TrendIndicatorProps {
  direction: TrendDirection;
  strength?: TrendStrength;
  label?: string;
  value?: string;
  description?: string;
  variant?: "default" | "compact" | "badge" | "detailed";
  className?: string;
}

const TREND_CONFIG = {
  up: {
    icon: "↑",
    color: "text-[#4ade80]",
    bg: "bg-[#4ade80]/10",
    border: "border-[#4ade80]/30",
    label: "Wzrost",
  },
  down: {
    icon: "↓",
    color: "text-[#f87171]",
    bg: "bg-[#f87171]/10",
    border: "border-[#f87171]/30",
    label: "Spadek",
  },
  neutral: {
    icon: "→",
    color: "text-[#fbbf24]",
    bg: "bg-[#fbbf24]/10",
    border: "border-[#fbbf24]/30",
    label: "Stabilny",
  },
};

const STRENGTH_LABELS = {
  strong: "Silny",
  moderate: "Umiarkowany",
  weak: "Słaby",
};

export default function TrendIndicator({
  direction,
  strength = "moderate",
  label,
  value,
  description,
  variant = "default",
  className = "",
}: TrendIndicatorProps) {
  const config = TREND_CONFIG[direction];

  if (variant === "badge") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} ${className}`}
      >
        <span>{config.icon}</span>
        {label || config.label}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <motion.span
          animate={{ y: direction === "up" ? [-2, 2] : direction === "down" ? [2, -2] : 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className={`text-lg ${config.color}`}
        >
          {config.icon}
        </motion.span>
        {value && <span className="text-sm font-medium text-[#f4f4f5]">{value}</span>}
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}
          >
            <span className={`text-2xl ${config.color}`}>{config.icon}</span>
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${config.color}`}>{label || config.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${config.bg} ${config.color}`}>
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
            {value && <p className="text-lg font-bold text-[#f4f4f5] mt-1">{value}</p>}
            {description && <p className="text-xs text-[#71717a] mt-1">{description}</p>}
          </div>
        </div>

        {/* Strength indicator bars */}
        <div className="flex gap-1 mt-4">
          {[1, 2, 3].map((bar) => (
            <motion.div
              key={bar}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: bar * 0.1 }}
              className={`flex-1 h-1 rounded-full origin-bottom ${
                (strength === "strong" && bar <= 3) ||
                (strength === "moderate" && bar <= 2) ||
                (strength === "weak" && bar <= 1)
                  ? config.bg.replace("/10", "")
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${config.bg} border ${config.border} ${className}`}>
      <motion.span
        animate={{ y: direction === "up" ? [-1, 1] : direction === "down" ? [1, -1] : 0 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className={`text-lg ${config.color}`}
      >
        {config.icon}
      </motion.span>
      <div>
        <span className={`text-xs font-medium ${config.color}`}>{label || config.label}</span>
        {value && <span className="text-xs text-[#a1a1aa] ml-2">{value}</span>}
      </div>
    </div>
  );
}

// Multi-trend summary
export function TrendSummary({
  trends,
  className = "",
}: {
  trends: { label: string; direction: TrendDirection; value?: string }[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {trends.map((trend, index) => (
        <TrendIndicator key={index} direction={trend.direction} label={trend.label} value={trend.value} variant="badge" />
      ))}
    </div>
  );
}

