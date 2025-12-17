"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getRssApiUrl } from "@/lib/api";
import { getRssArticleLink } from "@/lib/slug-utils";

interface NewsItem {
  title: string;
  link: string;
  originalUrl?: string;
}

const fallbackNews: NewsItem[] = [
  { title: "Ładowanie najnowszych wiadomości finansowych...", link: "/rynki" },
];

export default function BreakingNews() {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchBreakingNews() {
      try {
        const apiUrl = getRssApiUrl("all", 12);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        const items: NewsItem[] = data.items?.map((item: { title: string; link: string }) => ({
          title: item.title,
          link: getRssArticleLink(item.title, item.link),
          originalUrl: item.link,
        })) || [];

        if (items.length > 0) {
          setNews(items);
        }
      } catch {
        setNews([
          { title: "GPW: Notowania na żywo - śledź rynki finansowe", link: "/rynki" },
          { title: "Kursy walut NBP - aktualne notowania", link: "/waluty" },
          { title: "Kryptowaluty - Bitcoin, Ethereum i więcej", link: "/crypto" },
        ]);
      }
    }

    fetchBreakingNews();
    const interval = setInterval(fetchBreakingNews, 300000);
    return () => clearInterval(interval);
  }, []);

  // Nie renderuj na serwerze żeby uniknąć hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-gradient-to-r from-[#0f1115] via-[#1a1d24] to-[#0f1115] border-b border-[#c9a962]/30 h-[42px]" />
    );
  }

  const displayNews = [...news, ...news, ...news];

  return (
    <div
      className="bg-gradient-to-r from-[#0f1115] via-[#1a1d24] to-[#0f1115] border-b border-[#c9a962]/30 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-[#c9a962] to-[#e4d4a5] px-5 py-2.5 font-bold text-[11px] uppercase tracking-[0.15em] flex-shrink-0 text-[#08090c] flex items-center gap-2 shadow-[4px_0_16px_rgba(201,169,98,0.3)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]"></span>
          </span>
          Na żywo
        </div>

        <div className="overflow-hidden flex-1 relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0f1115] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0f1115] to-transparent z-10 pointer-events-none" />

          <motion.div
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
            {displayNews.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="text-[13px] font-medium flex items-center text-[#e4e4e7] mx-6 hover:text-[#c9a962] transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-[#c9a962] rounded-full mr-4 flex-shrink-0 opacity-60" />
                <span className="max-w-[400px] truncate">{item.title}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

