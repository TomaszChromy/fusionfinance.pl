"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketOverview from "@/components/MarketOverview";
import StocksSection from "@/components/sections/StocksSection";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";

export default function RynkiPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-[34px]">
        {/* Page header with gold accent */}
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-[34px]"
        >
          <div className="flex items-center gap-3 mb-[13px]">
            <div className="w-[55px] h-[3px] bg-gradient-to-r from-[#c9a962] to-[#9a7b3c] rounded-full" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5] mb-[13px]">Rynki finansowe</h1>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl leading-relaxed">
            Przegląd najważniejszych rynków finansowych na świecie — indeksy, surowce, obligacje
          </p>
        </motion.div>

        <MarketOverview />

        {/* Golden ratio grid: 61.8% / 38.2% */}
        <div className="grid grid-cols-1 lg:grid-cols-[61.8fr_38.2fr] gap-[34px] mt-[55px]">
          <div>
            {/* Notowania section */}
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Notowania i indeksy</h2>
            </div>
            <StocksSection />

            {/* Analizy section */}
            <div className="mt-[55px] pt-[34px] border-t border-white/5">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Analizy rynkowe</h2>
              </div>
              <div className="bg-[#0f1115] border border-[#c9a962]/10 rounded-lg p-[21px]">
                <RSSArticlesPaginated feedType="rynki" totalArticles={80} articlesPerPage={10} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Kalendarz ekonomiczny */}
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Kalendarz ekonomiczny</h2>
            </div>
            <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
              <div className="space-y-[13px]">
                {[
                  { time: "10:00", event: "PKB Niemcy (r/r)", impact: "high" },
                  { time: "11:00", event: "Inflacja CPI Polska", impact: "high" },
                  { time: "14:30", event: "Dane o zatrudnieniu USA", impact: "high" },
                  { time: "16:00", event: "ISM Manufacturing PMI", impact: "medium" },
                  { time: "20:00", event: "Decyzja FOMC", impact: "high" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-[13px] pb-[13px] border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-[12px] text-[#71717a] font-mono w-[42px]">{item.time}</span>
                    <span className={`w-[8px] h-[8px] rounded-full ${item.impact === "high" ? "bg-[#f87171]" : "bg-[#fbbf24]"}`} />
                    <span className="text-[13px] text-[#f4f4f5]">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wskaźniki sentymentu */}
            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#f7931a] to-[#f59e0b] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Wskaźniki sentymentu</h2>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px] space-y-[13px]">
                {[
                  { name: "Fear & Greed Index", value: 72, label: "Greed" },
                  { name: "VIX", value: 15.2, label: "Low volatility" },
                  { name: "Put/Call Ratio", value: 0.85, label: "Bullish" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-[13px] border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-[13px] text-[#a1a1aa]">{item.name}</span>
                    <div className="text-right">
                      <span className="text-[14px] font-medium text-[#f4f4f5]">{item.value}</span>
                      <span className="text-[11px] text-[#4ade80] ml-2">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

