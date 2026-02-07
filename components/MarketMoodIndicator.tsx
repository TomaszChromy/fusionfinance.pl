"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type MoodLevel = "extreme_fear" | "fear" | "neutral" | "greed" | "extreme_greed";

interface MarketMoodIndicatorProps {
  value?: number; // 0-100
  variant?: "default" | "compact" | "gauge" | "minimal";
  className?: string;
}

const MOOD_CONFIG: Record<MoodLevel, { label: string; color: string; bg: string; emoji: string }> = {
  extreme_fear: { label: "Ekstremalny strach", color: "#ef4444", bg: "bg-[#ef4444]", emoji: "😱" },
  fear: { label: "Strach", color: "#f87171", bg: "bg-[#f87171]", emoji: "😟" },
  neutral: { label: "Neutralny", color: "#fbbf24", bg: "bg-[#fbbf24]", emoji: "😐" },
  greed: { label: "Chciwość", color: "#4ade80", bg: "bg-[#4ade80]", emoji: "😊" },
  extreme_greed: { label: "Ekstremalna chciwość", color: "#22c55e", bg: "bg-[#22c55e]", emoji: "🤑" },
};

function getMoodLevel(value: number): MoodLevel {
  if (value <= 20) return "extreme_fear";
  if (value <= 40) return "fear";
  if (value <= 60) return "neutral";
  if (value <= 80) return "greed";
  return "extreme_greed";
}

export default function MarketMoodIndicator({
  value = 62,
  variant = "default",
  className = "",
}: MarketMoodIndicatorProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate counter
    const duration = 1000;
    const steps = 50;
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

  const mood = getMoodLevel(value);
  const config = MOOD_CONFIG[mood];

  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-lg">{config.emoji}</span>
        <span className="text-xs font-medium" style={{ color: config.color }}>
          {displayValue}
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 px-3 py-2 bg-[#0c0d10] border border-white/5 rounded-lg ${className}`}>
        <span className="text-xl">{config.emoji}</span>
        <div>
          <p className="text-xs text-[#71717a]">Fear & Greed</p>
          <p className="text-sm font-bold" style={{ color: config.color }}>
            {displayValue} - {config.label}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "gauge") {
    const rotation = (value / 100) * 180 - 90;
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <h3 className="text-sm font-medium text-[#f4f4f5] mb-4 text-center">Fear & Greed Index</h3>
        <div className="relative w-32 h-16 mx-auto overflow-hidden">
          {/* Background arc */}
          <div className="absolute inset-0 border-8 border-b-0 rounded-t-full"
            style={{ borderColor: `${config.color}20` }} />
          {/* Gradient arc */}
          <div className="absolute inset-0 border-8 border-b-0 rounded-t-full"
            style={{
              borderColor: config.color,
              clipPath: `polygon(0 100%, 0 0, ${value}% 0, ${value}% 100%)`,
            }} />
          {/* Needle */}
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute bottom-0 left-1/2 w-0.5 h-12 bg-[#f4f4f5] origin-bottom rounded-full"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          />
          {/* Center dot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#f4f4f5] rounded-full" />
        </div>
        <div className="text-center mt-3">
          <p className="text-2xl font-bold" style={{ color: config.color }}>{displayValue}</p>
          <p className="text-xs text-[#71717a]">{config.label}</p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>🎭</span>
          Fear & Greed Index
        </h3>
        <span className="text-xs text-[#52525b]">Aktualizacja: 1 godz. temu</span>
      </div>

      {/* Mood display */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl">{config.emoji}</span>
        <div>
          <p className="text-3xl font-bold" style={{ color: config.color }}>{displayValue}</p>
          <p className="text-sm text-[#a1a1aa]">{config.label}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gradient-to-r from-[#ef4444] via-[#fbbf24] to-[#22c55e] rounded-full overflow-hidden">
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${value}%` }}
          transition={{ duration: 1 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#08090c] shadow-lg"
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-[#52525b]">
        <span>Strach</span>
        <span>Chciwość</span>
      </div>

      {/* Description */}
      <p className="text-xs text-[#71717a] mt-4 leading-relaxed">
        {mood === "extreme_fear" && "Inwestorzy są bardzo zaniepokojeni. To może być dobry moment na zakupy."}
        {mood === "fear" && "Rynek jest ostrożny. Warto obserwować okazje."}
        {mood === "neutral" && "Nastroje rynkowe są zrównoważone."}
        {mood === "greed" && "Optymizm na rynku. Zachowaj ostrożność przy nowych pozycjach."}
        {mood === "extreme_greed" && "Rynek może być przegrzany. Rozważ realizację zysków."}
      </p>
    </div>
  );
}
