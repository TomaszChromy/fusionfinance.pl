"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BreakingNews from "@/components/BreakingNews";
import RSSFeatured from "@/components/RSSFeatured";
import MarketOverview from "@/components/MarketOverview";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";
import StocksSection from "@/components/sections/StocksSection";
import ForexSection from "@/components/sections/ForexSection";
import CryptoSection from "@/components/sections/CryptoSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <BreakingNews />

      {/* Luxury main container with golden ratio */}
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">

        {/* MARKET TICKER */}
        <MarketOverview />

        {/* FEATURED SECTION */}
        <RSSFeatured />

        {/* MAIN CONTENT - Golden ratio grid: 61.8% / 38.2% */}
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-[61.8fr_38.2fr] gap-[34px] mt-[55px] pt-[34px] border-t border-[#c9a962]/20"
        >

          {/* MAIN COLUMN - Articles (61.8%) */}
          <div className="lg:pr-[34px] lg:border-r border-white/5">
            {/* Section header with gold accent */}
            <div className="flex items-center gap-3 mb-[21px] pb-[13px] border-b border-white/5">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Najnowsze wiadomości</h2>
            </div>

            <div className="bg-[#0f1115] border border-[#c9a962]/10 rounded-lg p-[21px]">
              <RSSArticlesPaginated feedType="all" totalArticles={100} articlesPerPage={12} />
            </div>

            {/* Stocks section */}
            <div className="mt-[55px] pt-[34px] border-t border-white/5">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Rynek akcji</h2>
              </div>
              <StocksSection />
            </div>
          </div>

          {/* RIGHT SIDEBAR (38.2%) */}
          <aside className="mt-[34px] lg:mt-0">
            {/* Forex section */}
            <div className="mb-[34px]">
              <div className="flex items-center gap-3 mb-[13px] pb-[13px] border-b border-white/5">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
                <h3 className="text-[12px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Waluty</h3>
              </div>
              <ForexSection />
            </div>

            {/* Elegant divider */}
            <div className="flex items-center gap-3 my-[21px]">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#c9a962]/30" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a962]/40" />
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#c9a962]/30" />
            </div>

            {/* Crypto section */}
            <div>
              <div className="flex items-center gap-3 mb-[13px] pb-[13px] border-b border-white/5">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#f7931a] to-[#f59e0b] rounded-full" />
                <h3 className="text-[12px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Kryptowaluty</h3>
              </div>
              <CryptoSection />
            </div>
          </aside>
        </motion.div>

        {/* FOOTER */}
        <Footer />
      </div>
    </main>
  );
}
