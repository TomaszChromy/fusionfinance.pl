"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Tip {
  id: string;
  category: "strategy" | "risk" | "psychology" | "technical" | "fundamental";
  title: string;
  content: string;
  level: "beginner" | "intermediate" | "advanced";
}

const MOCK_TIPS: Tip[] = [
  { id: "1", category: "risk", title: "Zasada 1%", content: "Nie ryzykuj więcej niż 1% kapitału na pojedynczą transakcję.", level: "beginner" },
  { id: "2", category: "psychology", title: "Kontroluj emocje", content: "Strach i chciwość to najwięksi wrogowie tradera. Trzymaj się planu.", level: "beginner" },
  { id: "3", category: "strategy", title: "Stop Loss", content: "Zawsze ustawiaj stop loss przed otwarciem pozycji.", level: "beginner" },
  { id: "4", category: "technical", title: "Trend is your friend", content: "Handluj zgodnie z trendem, nie przeciwko niemu.", level: "intermediate" },
  { id: "5", category: "fundamental", title: "Śledź kalendarz", content: "Ważne wydarzenia ekonomiczne mogą gwałtownie wpłynąć na rynek.", level: "intermediate" },
  { id: "6", category: "strategy", title: "Dywersyfikacja", content: "Nie wkładaj wszystkich jajek do jednego koszyka.", level: "beginner" },
];

const categoryConfig = {
  strategy: { icon: "♟️", color: "text-[#60a5fa]", bg: "bg-[#60a5fa]/10" },
  risk: { icon: "🛡️", color: "text-[#f87171]", bg: "bg-[#f87171]/10" },
  psychology: { icon: "🧠", color: "text-[#a78bfa]", bg: "bg-[#a78bfa]/10" },
  technical: { icon: "📊", color: "text-[#4ade80]", bg: "bg-[#4ade80]/10" },
  fundamental: { icon: "📰", color: "text-[#fbbf24]", bg: "bg-[#fbbf24]/10" },
};

const levelConfig = {
  beginner: { label: "Początkujący", color: "text-[#4ade80]" },
  intermediate: { label: "Średni", color: "text-[#fbbf24]" },
  advanced: { label: "Zaawansowany", color: "text-[#f87171]" },
};

interface TradingTipsProps {
  tips?: Tip[];
  autoRotate?: boolean;
  rotateInterval?: number;
  variant?: "default" | "compact" | "carousel";
  className?: string;
}

export default function TradingTips({
  tips = MOCK_TIPS,
  autoRotate = true,
  rotateInterval = 8000,
  variant = "default",
  className = "",
}: TradingTipsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, tips.length]);

  const currentTip = tips[currentIndex];
  const config = categoryConfig[currentTip.category];
  const level = levelConfig[currentTip.level];

  if (variant === "compact") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-lg p-3 ${className}`}>
        <div className="flex items-start gap-3">
          <span className="text-lg">{config.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#f4f4f5] truncate">{currentTip.title}</p>
            <p className="text-[10px] text-[#71717a] line-clamp-2 mt-0.5">{currentTip.content}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "carousel") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
            <span>💡</span>
            Wskazówka dnia
          </h3>
          <span className={`text-[10px] ${level.color}`}>{level.label}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4"
          >
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${config.bg} mb-3`}>
              <span className="text-sm">{config.icon}</span>
              <span className={`text-[10px] font-medium ${config.color}`}>{currentTip.category}</span>
            </div>
            <h4 className="text-base font-medium text-[#f4f4f5] mb-2">{currentTip.title}</h4>
            <p className="text-sm text-[#a1a1aa]">{currentTip.content}</p>
          </motion.div>
        </AnimatePresence>
        <div className="px-4 pb-4 flex gap-1">
          {tips.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all ${i === currentIndex ? "w-4 bg-[#c9a962]" : "w-1 bg-white/10"}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default - list
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>💡</span>
          Porady tradingowe
        </h3>
      </div>
      <div className="divide-y divide-white/5">
        {tips.slice(0, 5).map((tip, index) => {
          const tipConfig = categoryConfig[tip.category];
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className={`text-lg ${tipConfig.bg} w-8 h-8 rounded-lg flex items-center justify-center`}>
                  {tipConfig.icon}
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-[#f4f4f5]">{tip.title}</h4>
                  <p className="text-xs text-[#71717a] mt-1">{tip.content}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
