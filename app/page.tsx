"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BreakingNews from "@/components/BreakingNews";
import RSSFeatured from "@/components/RSSFeatured";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";
import MarketSidebar from "@/components/MarketSidebar";
import Footer from "@/components/Footer";
import MarketStatus from "@/components/MarketStatus";
import { DailyQuote } from "@/components/QuoteCard";
import LiveIndicator from "@/components/LiveIndicator";
import { WeatherStrip } from "@/components/WeatherWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <BreakingNews />

      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-6 lg:py-8">

        {/* HERO - Wyróżnione artykuły */}
        <RSSFeatured />

        {/* MAIN CONTENT - Dwie kolumny */}
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 mt-10 lg:mt-14"
        >
          {/* LEWA KOLUMNA - Artykuły */}
          <div>
            {/* Nagłówek sekcji */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#c9a962]/20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
                <div>
                  <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Najnowsze wiadomości</h2>
                  <p className="text-xs text-[#71717a] mt-0.5">Aktualne informacje z rynków finansowych</p>
                </div>
              </div>
              <LiveIndicator label="Na żywo" />
            </div>

            {/* Lista artykułów */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 lg:p-8">
              <RSSArticlesPaginated feedType="all" totalArticles={80} articlesPerPage={10} />
            </div>
          </div>

          {/* PRAWA KOLUMNA - Dane rynkowe */}
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-[#c9a962]/20 scrollbar-track-transparent space-y-5">
            {/* Nagłówek sidebara */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-7 bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
              <div>
                <h2 className="text-base font-serif font-medium text-[#f4f4f5]">Dane rynkowe</h2>
                <p className="text-[10px] text-[#71717a] mt-0.5 uppercase tracking-wider">Aktualizowane na żywo</p>
              </div>
            </div>

            <MarketSidebar />

            {/* Market Status */}
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-[#f4f4f5]">Status giełd</span>
              </div>
              <div className="space-y-3">
                <MarketStatus marketId="gpw" variant="compact" />
                <MarketStatus marketId="nyse" variant="compact" />
                <MarketStatus marketId="crypto" variant="compact" />
              </div>
            </div>

            {/* Daily Quote */}
            <DailyQuote className="mt-5" />

            {/* Weather */}
            <div className="mt-5 p-4 bg-[#0c0d10] border border-white/5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-[#f4f4f5]">🌤️ Pogoda w centrach finansowych</span>
              </div>
              <WeatherStrip />
            </div>
          </aside>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
