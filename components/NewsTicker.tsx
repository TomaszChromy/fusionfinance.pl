"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  link?: string;
  category?: string;
  time?: string;
  isBreaking?: boolean;
}

const MOCK_NEWS: NewsItem[] = [
  { id: "1", title: "RPP utrzymuje stopy procentowe bez zmian", category: "Polska", time: "5 min", isBreaking: true },
  { id: "2", title: "EUR/PLN spada poniżej 4,30 po danych z Niemiec", category: "Forex", time: "12 min" },
  { id: "3", title: "Bitcoin przekracza 100 000 USD - nowy ATH", category: "Crypto", time: "25 min", isBreaking: true },
  { id: "4", title: "WIG20 zamyka sesję na plusie +1,2%", category: "GPW", time: "1 godz." },
  { id: "5", title: "Fed sygnalizuje możliwą obniżkę stóp w Q1 2025", category: "USA", time: "2 godz." },
  { id: "6", title: "Ceny ropy Brent rosną po danych OPEC", category: "Surowce", time: "3 godz." },
  { id: "7", title: "Złoto testuje poziom 2100 USD/oz", category: "Metale", time: "4 godz." },
];

interface NewsTickerProps {
  news?: NewsItem[];
  speed?: number;
  className?: string;
  variant?: "default" | "compact" | "minimal";
}

export default function NewsTicker({
  news = MOCK_NEWS,
  speed = 30,
  className = "",
  variant = "default",
}: NewsTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const duplicatedNews = [...news, ...news];

  if (variant === "minimal") {
    return (
      <div className={`overflow-hidden ${className}`}>
        <motion.div
          animate={{ x: isPaused ? 0 : "-50%" }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-8 whitespace-nowrap"
        >
          {duplicatedNews.map((item, index) => (
            <span key={`${item.id}-${index}`} className="text-xs text-[#a1a1aa]">
              {item.isBreaking && <span className="text-[#f87171] mr-1">●</span>}
              {item.title}
            </span>
          ))}
        </motion.div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-[#0c0d10] border-y border-white/5 py-2 overflow-hidden ${className}`}>
        <motion.div
          animate={{ x: isPaused ? 0 : "-50%" }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 whitespace-nowrap"
        >
          {duplicatedNews.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-2">
              {item.isBreaking && (
                <span className="px-1.5 py-0.5 bg-[#f87171]/20 text-[#f87171] text-[9px] font-bold uppercase rounded">
                  Breaking
                </span>
              )}
              <span className="text-xs text-[#f4f4f5]">{item.title}</span>
              <span className="text-[10px] text-[#52525b]">{item.time}</span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#f87171] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-[#f4f4f5] uppercase tracking-wider">Na żywo</span>
        </div>
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="text-[10px] text-[#71717a] hover:text-[#c9a962] transition-colors"
        >
          {isPaused ? "▶ Wznów" : "⏸ Pauza"}
        </button>
      </div>

      {/* Ticker */}
      <div className="py-3 overflow-hidden">
        <motion.div
          animate={{ x: isPaused ? 0 : "-50%" }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-8 whitespace-nowrap px-4"
        >
          {duplicatedNews.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={item.link || "#"}
              className="flex items-center gap-3 group"
            >
              {item.isBreaking && (
                <span className="px-2 py-0.5 bg-[#f87171] text-white text-[9px] font-bold uppercase rounded">
                  Breaking
                </span>
              )}
              <span className="px-2 py-0.5 bg-[#c9a962]/20 text-[#c9a962] text-[10px] font-medium rounded">
                {item.category}
              </span>
              <span className="text-sm text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors">
                {item.title}
              </span>
              <span className="text-[10px] text-[#52525b]">{item.time}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

