"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticlesPaginated from "@/components/ArticlesPaginated";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CategoryBadge } from "@/components/Badge";
import { InfoTooltip } from "@/components/Tooltip";
import Calculator from "@/components/Calculator";
import Glossary from "@/components/Glossary";
import RiskMeter from "@/components/RiskMeter";
import PremiumAnalyses from "@/components/PremiumAnalyses";
import EditorialArticles from "@/components/EditorialArticles";
import PageHero from "@/components/PageHero";

export default function AnalizyPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 py-[34px]">
        <Breadcrumbs />
        <PageHero
          title="Analizy"
          subtitle="Fundamentalne i techniczne, prognozy, rekomendacje – w stylu money.pl/bankier/obserwator."
          eyebrow="Narzędzia"
          badge="Agregator PL"
          rightSlot={<CategoryBadge category="analizy" />}
        />

        {/* Premium Analyses Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-gradient-to-b from-[#c9a962] to-[#e5c76e] rounded-full" />
            <div>
              <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Ekskluzywne analizy</h2>
              <p className="text-xs text-[#71717a] mt-0.5">Premium content od naszych ekspertów</p>
            </div>
          </div>
          <PremiumAnalyses />
        </div>

        {/* Editorial articles */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] rounded-full" />
            <div>
              <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Artykuły redakcyjne</h2>
              <p className="text-xs text-[#71717a] mt-0.5">Treści przygotowane przez zespół FusionFinance</p>
            </div>
          </div>
          <EditorialArticles limit={6} category="analizy" />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-8 lg:gap-12">
          {/* Left column - Articles */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#a78bfa]/20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] rounded-full" />
                <div>
                  <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Analizy rynkowe</h2>
                  <p className="text-xs text-[#71717a] mt-0.5">Prognozy, rekomendacje, strategie</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] text-[#71717a] uppercase tracking-wider font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a78bfa] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a78bfa]"></span>
                </span>
                Na żywo
                <InfoTooltip content="Artykuły aktualizowane automatycznie co 5 minut" />
              </div>
            </div>

            {/* Lista artykułów */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 lg:p-8">
              <ArticlesPaginated category="analizy" articlesPerPage={12} />
            </div>
          </div>

          {/* Right column - Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-[#c9a962]/20 scrollbar-track-transparent space-y-6">
            {/* Nagłówek sidebara */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] rounded-full" />
              <div>
                <h2 className="text-base font-serif font-medium text-[#f4f4f5]">Narzędzia analityczne</h2>
                <p className="text-[10px] text-[#71717a] mt-0.5 uppercase tracking-wider">Dla inwestorów</p>
              </div>
            </div>

            {/* Snapshot – harmoniczne proporcje */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#f4f4f5]">Szybki pulpit</h3>
                <span className="text-[10px] text-[#c9a962] uppercase tracking-wide">φ layout</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[11px] text-[#71717a]">Stopa NBP</p>
                  <p className="text-lg font-semibold text-[#f4f4f5]">5,75%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[11px] text-[#71717a]">Inflacja CPI</p>
                  <p className="text-lg font-semibold text-[#f4f4f5]">5,3%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[11px] text-[#71717a]">EUR/PLN</p>
                  <p className="text-lg font-semibold text-[#f4f4f5]">4,32</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[11px] text-[#71717a]">BTC/USD</p>
                  <p className="text-lg font-semibold text-[#f4f4f5]">42 500</p>
                </div>
              </div>
            </div>

            {/* Financial Calculator */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-5">
              <Calculator />
            </div>

            {/* Glossary */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-5">
              <Glossary variant="compact" />
            </div>

            {/* Risk Meter */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-5">
              <RiskMeter value={45} variant="gauge" />
            </div>

          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
