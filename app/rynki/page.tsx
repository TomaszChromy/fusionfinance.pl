"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { CategoryBadge } from "@/components/Badge";
import { InfoTooltip } from "@/components/Tooltip";
import LiveIndicator from "@/components/LiveIndicator";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";
import { RSSFeatured } from "@/components/hero";

export default function RynkiPage() {

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 py-[34px]">
        <Breadcrumbs />
        <PageHero
          title="Polska"
          subtitle="Wiadomości gospodarcze z Polski: GPW, makro NBP, budżet, inflacja, stopy procentowe."
          eyebrow="Ekonomia i rynki PL"
          badge="Live"
          rightSlot={<CategoryBadge category="rynki" />}
        />

        <div className="flex flex-col gap-10 lg:gap-12 mt-6">
          <RSSFeatured
            feedType="polska"
            title="Polska – wyróżnione artykuły"
            description="Kluczowe informacje z polskich portali finansowych"
            eyebrow="Najważniejsze PL"
          />

          <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 lg:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#c9a962]/20">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
                <div>
                  <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Artykuły</h2>
                  <p className="text-xs text-[#71717a] mt-0.5">Kafelki z miniaturami – aktualizowane na żywo</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <LiveIndicator label="Na żywo" />
                <InfoTooltip content="Aktualizacja co 5 minut" />
              </div>
            </div>

            <RSSArticlesPaginated feedType="polska" totalArticles={64} articlesPerPage={12} showImage />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
