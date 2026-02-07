"use client";

import { motion } from "framer-motion";

// Layout
import { Navbar, Footer } from "@/components/layout";

// Navigation
import { BreakingNews } from "@/components/navigation";

// Hero
import { RSSFeatured } from "@/components/hero";
import Breadcrumbs from "@/components/Breadcrumbs";

// News
import { MarketNews } from "@/components/news";
import ArticlesPaginated from "@/components/ArticlesPaginated";

// Sidebar
import {
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
        <Breadcrumbs />

        {/* HERO - Wyróżnione artykuły */}
        <section aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="sr-only">Wyróżnione artykuły</h2>
          <RSSFeatured />
        </section>

        {/* MAIN CONTENT */}
        <motion.section
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 lg:mt-16 space-y-6"
        >
          <section aria-labelledby="news-heading" className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#c9a962]/20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
                <div>
                  <h2 id="news-heading" className="text-xl font-serif font-medium text-[#f4f4f5]">Artykuły</h2>
                </div>
              </div>
              <LiveIndicator label="Na żywo" />
            </div>

            <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 lg:p-8">
              <ArticlesPaginated articlesPerPage={14} />
            </div>

            <DailyQuote />

            {/* CTA w miejscu dawnej kolumny bocznej */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-[#0c0d10] via-[#11131a] to-[#0c0d10] p-6 lg:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,169,98,0.08),transparent_36%)]" />
              <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#c9a962]">Alerty + watchlista</p>
                  <h3 className="text-lg font-serif text-[#f4f4f5]">Podbij ważne tematy i kursy, które śledzisz</h3>
                  <p className="text-sm text-[#a1a1aa] max-w-2xl">
                    Włącz powiadomienia dla swoich ulubionych spółek, walut i kryptowalut. Synchronizacja między urządzeniami bez logowania do bazy.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a href="/alerty/" className="px-4 py-2 rounded-lg bg-[#c9a962] text-[#08090c] text-sm font-semibold hover:brightness-110 transition">
                    Skonfiguruj alerty
                  </a>
                  <a href="/watchlista/" className="px-4 py-2 rounded-lg border border-[#c9a962]/50 text-[#c9a962] text-sm font-semibold hover:border-[#c9a962] transition">
                    Otwórz watchlistę
                  </a>
                </div>
              </div>
            </div>
          </section>
        </motion.section>

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
