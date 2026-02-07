"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getRssApiUrl } from "@/lib/api";
import { getRssArticleLink } from "@/lib/slug-utils";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  date: string;
  originalUrl?: string;
}

// Mapowanie źródeł na kolory i ikony
const sourceConfig: Record<string, { icon: string; color: string }> = {
  "Bankier.pl": { icon: "💹", color: "text-[#c9a962]" },
  "Money.pl": { icon: "💰", color: "text-[#4ade80]" },
  "Parkiet": { icon: "📊", color: "text-[#60a5fa]" },
  "Business Insider": { icon: "📈", color: "text-[#f472b6]" },
  "Puls Biznesu": { icon: "📰", color: "text-[#a78bfa]" },
  "GPW": { icon: "🏛️", color: "text-[#c9a962]" },
  "Stooq": { icon: "📉", color: "text-[#22d3ee]" },
  "Forsal": { icon: "💼", color: "text-[#fb923c]" },
  "default": { icon: "📄", color: "text-[#71717a]" },
};

function getSourceConfig(source: string) {
  return sourceConfig[source] || sourceConfig["default"];
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "teraz";
  if (diffMin < 60) return `${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} godz.`;
  return `${Math.floor(diffHours / 24)} dni`;
}

interface MarketNewsProps {
  maxItems?: number;
  className?: string;
}

export default function MarketNews({
  maxItems = 5,
  className = "",
}: MarketNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const apiUrl = getRssApiUrl("all", maxItems + 2);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const items = (data.items?.slice(0, maxItems) || []).map((item: NewsItem) => ({
          ...item,
          source: item.source || "default",
          link: getRssArticleLink(item.title, item.link),
          originalUrl: item.link,
        }));
        setNews(items);
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, [maxItems]);

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#0f1115] to-[#0c0d10]">
        <h3 className="text-sm font-semibold text-[#f4f4f5] flex items-center gap-2">
          <span>⚡</span>
          Flash News
        </h3>
        <span className="text-[10px] text-[#71717a]">
          Ostatnie aktualizacje
        </span>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-2 bg-white/5 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#71717a]">
            Brak wiadomości
          </div>
        ) : (
          news.map((item, index) => {
            const config = getSourceConfig(item.source);
            return (
              <motion.div
                key={item.link}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="block p-3 hover:bg-white/[0.02] transition-colors group"
              >
                <Link href={item.link} className="flex items-start gap-2.5">
                  <span className="text-sm mt-0.5 shrink-0">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#e4e4e7] leading-relaxed group-hover:text-[#c9a962] transition-colors line-clamp-2">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`text-[10px] font-medium ${config.color}`}>
                        {item.source}
                      </span>
                      <span className="text-[10px] text-[#52525b]">•</span>
                      <span className="text-[10px] text-[#52525b]">
                        {formatTimeAgo(item.date)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-white/5 bg-[#0a0b0e]">
        <Link
          href="/rynki"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4
                     border border-[#c9a962]/30 hover:border-[#c9a962]
                     text-[#c9a962] hover:text-[#e4d4a5] hover:bg-[#c9a962]/5
                     text-xs font-medium rounded-lg transition-all duration-200
                     group"
        >
          <span>Zobacz wszystkie wiadomości</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
