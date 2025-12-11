"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getRssApiUrl } from "@/lib/api";

const fallbackNews = [
  "Ładowanie najnowszych wiadomości finansowych...",
];

export default function BreakingNews() {
  const [news, setNews] = useState<string[]>(fallbackNews);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const apiUrl = getRssApiUrl("all", 12);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        const headlines = data.items?.map((item: { title: string }) => item.title) || [];

        if (headlines.length > 0) {
          setNews(headlines);
        }
      } catch {
        setNews([
          "GPW: Notowania na żywo - śledź rynki finansowe",
          "Kursy walut NBP - aktualne notowania",
          "Kryptowaluty - Bitcoin, Ethereum i więcej",
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchBreakingNews();

    // Odśwież co 5 minut
    const interval = setInterval(fetchBreakingNews, 300000);
    return () => clearInterval(interval);
  }, []);

  // Duplikuj wiadomości 3x dla płynnej animacji
  const displayNews = [...news, ...news, ...news];

  return (
    <div
      className="bg-gradient-to-r from-[#0f1115] via-[#1a1d24] to-[#0f1115] border-b border-[#c9a962]/30 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        {/* Breaking label z animowaną kropką */}
        <div className="bg-gradient-to-r from-[#c9a962] to-[#e4d4a5] px-5 py-2.5 font-bold text-[11px] uppercase tracking-[0.15em] flex-shrink-0 text-[#08090c] flex items-center gap-2 shadow-[4px_0_16px_rgba(201,169,98,0.3)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]"></span>
          </span>
          Na żywo
        </div>

        {/* Ticker */}
        <div className="overflow-hidden flex-1 relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0f1115] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0f1115] to-transparent z-10 pointer-events-none" />

          <motion.div
            key={news.length}
            animate={{ x: isPaused ? undefined : [0, -4500] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            className="flex items-center whitespace-nowrap py-2.5 px-8"
          >
            {displayNews.map((headline, index) => (
              <span
                key={index}
                className="text-[13px] font-medium flex items-center text-[#e4e4e7] mx-6 hover:text-[#c9a962] transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 bg-[#c9a962] rounded-full mr-4 flex-shrink-0 opacity-60" />
                <span className="max-w-[400px] truncate">{headline}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

