"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketSidebar from "@/components/MarketSidebar";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";
import GPWStocksTable from "@/components/GPWStocksTable";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CategoryBadge } from "@/components/Badge";
import { InfoTooltip } from "@/components/Tooltip";
import HeatMap from "@/components/HeatMap";
import TrendIndicator from "@/components/TrendIndicator";

export default function GieldaPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 py-[34px]">
        <Breadcrumbs />
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-[34px]"
        >
          <div className="flex items-center gap-3 mb-[13px]">
            <div className="w-[55px] h-[3px] bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-full" />
          </div>
          <div className="flex items-center gap-3 mb-[13px]">
            <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5]">Giełda</h1>
            <CategoryBadge category="gielda" />
          </div>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl leading-relaxed">
            Notowania spółek GPW, WIG20, mWIG40, sWIG80, dywidendy, IPO i debiuty giełdowe
          </p>
        </motion.div>

        {/* GPW Stocks Table */}
        <div className="mb-8">
          <GPWStocksTable />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          {/* Left column - Articles */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4ade80]/20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
                <div>
                  <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Wiadomości giełdowe</h2>
                  <p className="text-xs text-[#71717a] mt-0.5">Notowania, spółki, indeksy GPW</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] text-[#71717a] uppercase tracking-wider font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]"></span>
                </span>
                Na żywo
                <InfoTooltip content="Artykuły aktualizowane automatycznie co 5 minut" />
              </div>
            </div>

            {/* Lista artykułów */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 lg:p-8">
              <RSSArticlesPaginated feedType="gielda" totalArticles={80} articlesPerPage={12} />
            </div>
          </div>

          {/* Right column - Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-[#c9a962]/20 scrollbar-track-transparent space-y-5">
            {/* Nagłówek sidebara */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
              <div>
                <h2 className="text-base font-serif font-medium text-[#f4f4f5]">Dane giełdowe</h2>
                <p className="text-[10px] text-[#71717a] mt-0.5 uppercase tracking-wider">Aktualizowane na żywo</p>
              </div>
            </div>

            <MarketSidebar />

            {/* Heat Map */}
            <HeatMap title="Mapa ciepła WIG20" />

            {/* Trend indicators */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
              <h3 className="text-xs font-semibold text-[#f4f4f5] uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
                <span>📊</span> Trendy indeksów
              </h3>
              <div className="space-y-2">
                <TrendIndicator direction="up" strength="moderate" label="WIG20" value="+0.54%" />
                <TrendIndicator direction="down" strength="weak" label="mWIG40" value="-0.23%" />
                <TrendIndicator direction="up" strength="strong" label="sWIG80" value="+1.12%" />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

