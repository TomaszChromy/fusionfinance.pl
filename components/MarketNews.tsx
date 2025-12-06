"use client";

import { motion } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: "positive" | "negative" | "neutral";
  isBreaking?: boolean;
}

const MOCK_NEWS: NewsItem[] = [
  { id: "1", title: "Fed utrzymuje stopy procentowe bez zmian", source: "Reuters", time: "5 min", category: "neutral", isBreaking: true },
  { id: "2", title: "WIG20 przebija poziom 2500 punktów", source: "PAP", time: "23 min", category: "positive" },
  { id: "3", title: "Bitcoin osiąga nowe ATH powyżej $100,000", source: "CoinDesk", time: "1 godz.", category: "positive" },
  { id: "4", title: "Inflacja w Polsce spada do 4.5%", source: "GUS", time: "2 godz.", category: "positive" },
  { id: "5", title: "Orlen ogłasza nową strategię do 2030", source: "ISBnews", time: "3 godz.", category: "neutral" },
  { id: "6", title: "EUR/PLN spada poniżej 4.30", source: "Bloomberg", time: "4 godz.", category: "positive" },
];

const categoryConfig = {
  positive: { icon: "📈", color: "text-[#4ade80]", bg: "bg-[#4ade80]/10", border: "border-[#4ade80]/20" },
  negative: { icon: "📉", color: "text-[#f87171]", bg: "bg-[#f87171]/10", border: "border-[#f87171]/20" },
  neutral: { icon: "📊", color: "text-[#fbbf24]", bg: "bg-[#fbbf24]/10", border: "border-[#fbbf24]/20" },
};

interface MarketNewsProps {
  news?: NewsItem[];
  maxItems?: number;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export default function MarketNews({
  news = MOCK_NEWS,
  maxItems = 6,
  variant = "default",
  className = "",
}: MarketNewsProps) {
  if (variant === "minimal") {
    return (
      <div className={`space-y-2 ${className}`}>
        {news.slice(0, maxItems).map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <span>{categoryConfig[item.category].icon}</span>
            <span className="text-[#f4f4f5] truncate flex-1">{item.title}</span>
            <span className="text-[#52525b]">{item.time}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-lg divide-y divide-white/5 ${className}`}>
        {news.slice(0, maxItems).map((item, index) => {
          const config = categoryConfig[item.category];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="p-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2">
                {item.isBreaking && (
                  <span className="px-1.5 py-0.5 bg-[#f87171] text-[#08090c] text-[8px] font-bold rounded animate-pulse">
                    LIVE
                  </span>
                )}
                <p className="text-xs text-[#f4f4f5] flex-1 line-clamp-2">{item.title}</p>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] ${config.color}`}>{item.source}</span>
                <span className="text-[10px] text-[#52525b]">•</span>
                <span className="text-[10px] text-[#52525b]">{item.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>📰</span>
          Wiadomości rynkowe
        </h3>
        <span className="text-[10px] text-[#4ade80] flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse" />
          Na żywo
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {news.slice(0, maxItems).map((item, index) => {
          const config = categoryConfig[item.category];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                item.isBreaking ? `border-l-2 ${config.border}` : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-lg ${config.bg} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>
                  {config.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.isBreaking && (
                      <span className="px-1.5 py-0.5 bg-[#f87171] text-[#08090c] text-[8px] font-bold rounded animate-pulse">
                        BREAKING
                      </span>
                    )}
                    <span className={`text-[10px] font-medium ${config.color}`}>{item.source}</span>
                    <span className="text-[10px] text-[#52525b]">•</span>
                    <span className="text-[10px] text-[#52525b]">{item.time}</span>
                  </div>
                  <h4 className="text-sm font-medium text-[#f4f4f5]">{item.title}</h4>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5">
        <button
          type="button"
          className="w-full text-center text-xs text-[#c9a962] hover:text-[#e4d4a5] transition-colors"
        >
          Zobacz wszystkie wiadomości →
        </button>
      </div>
    </div>
  );
}

