"use client";

import { motion } from "framer-motion";

// Layout
import { Navbar, Footer } from "@/components/layout";

// Navigation
import { BreakingNews } from "@/components/navigation";

// Hero
import { RSSFeatured } from "@/components/hero";

// News
import { RSSArticlesPaginated, MarketNews } from "@/components/news";

// Sidebar
import {
  MarketSidebar,
  MarketStatus,
  MarketMoodIndicator,
  DailyQuote,
  LiveIndicator,
  SocialProof,
  QuickActions,
} from "@/components/sidebar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <BreakingNews />

      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-8 lg:py-12">

        {/* SEO H1 - wizualnie ukryty ale dostępny dla SEO */}
        <h1 className="sr-only">FusionFinance - Portal Finansowy z Aktualnymi Wiadomościami z Giełdy, Kryptowalut i Rynków</h1>

        {/* HERO - Wyróżnione artykuły */}
        <section aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="sr-only">Wyróżnione artykuły</h2>
          <RSSFeatured />
        </section>

        {/* MAIN CONTENT - Dwie kolumny */}
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 mt-12 lg:mt-16"
        >
          {/* LEWA KOLUMNA - Artykuły */}
          <section aria-labelledby="news-heading">
            {/* Nagłówek sekcji */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#c9a962]/20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
                <div>
                  <h2 id="news-heading" className="text-xl font-serif font-medium text-[#f4f4f5]">Najnowsze wiadomości</h2>
                  <p className="text-sm text-[#71717a] mt-1">Aktualne informacje z rynków finansowych</p>
                </div>
              </div>
              <LiveIndicator label="Na żywo" />
            </div>

            {/* Lista artykułów */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 lg:p-8">
              <RSSArticlesPaginated feedType="all" totalArticles={80} articlesPerPage={10} />
            </div>
          </section>

          {/* PRAWA KOLUMNA - Dane rynkowe */}
          <aside aria-label="Dane rynkowe" className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-[#c9a962]/20 scrollbar-track-transparent space-y-6">
            {/* Nagłówek sidebara */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-7 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
              <div>
                <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Dane rynkowe</h2>
                <p className="text-xs text-[#71717a] mt-0.5 uppercase tracking-wider">Aktualizowane na bieżąco</p>
              </div>
            </div>

            <MarketSidebar />

            {/* Market Status */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
              <h3 className="text-xs font-semibold text-[#f4f4f5] uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                <span>🏛️</span> Status giełd
              </h3>
              <div className="space-y-3">
                <MarketStatus marketId="gpw" variant="compact" />
                <MarketStatus marketId="nyse" variant="compact" />
                <MarketStatus marketId="crypto" variant="compact" />
              </div>
            </div>

            {/* Daily Quote */}
            <DailyQuote />
          </aside>
        </motion.div>

        {/* Market Mood - zwiększony margines */}
        <motion.section
          aria-labelledby="mood-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20"
        >
          <h2 id="mood-heading" className="sr-only">Nastrój rynkowy</h2>
          <MarketMoodIndicator variant="compact" />
        </motion.section>

        {/* Market News - Flash News */}
        <motion.section
          aria-labelledby="flash-news-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 lg:mt-16"
        >
          <h2 id="flash-news-heading" className="sr-only">Szybkie wiadomości</h2>
          <MarketNews maxItems={5} />
        </motion.section>

        {/* Social Proof Section - zwiększony margines */}
        <motion.section
          aria-labelledby="stats-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 lg:mt-24 mb-8"
        >
          <h2 id="stats-heading" className="sr-only">Statystyki portalu</h2>
          <SocialProof variant="compact" />
        </motion.section>
      </div>

      <Footer />

      {/* Quick Actions FAB */}
      <QuickActions />
    </main>
  );
}
