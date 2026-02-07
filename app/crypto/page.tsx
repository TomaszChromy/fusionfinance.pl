"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { CategoryBadge } from "@/components/Badge";
import { CryptoGrid } from "@/components/CryptoPrice";
import Glossary from "@/components/Glossary";
import MarketMoodIndicator from "@/components/MarketMoodIndicator";
import PriceComparison from "@/components/PriceComparison";

export default function CryptoPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 py-[34px]">
        <Breadcrumbs />
        <PageHero
          title="Kryptowaluty"
          subtitle="BTC, ETH, DeFi, NFT – wiadomości, kursy i nastroje rynku w jednym miejscu."
          eyebrow="Crypto hub"
          badge="Live"
          accentFrom="#f7931a"
          accentTo="#f59e0b"
          rightSlot={<CategoryBadge category="crypto" />}
        />

        <div className="space-y-8 lg:space-y-10">
          <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-5 lg:p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-7 bg-gradient-to-b from-[#f7931a] to-[#f59e0b] rounded-full" />
              <div>
                <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Kursy kryptowalut</h2>
                <p className="text-xs text-[#71717a]">BTC, ETH, SOL, ADA, BNB, XRP</p>
              </div>
            </div>
            <CryptoGrid limit={8} variant="grid" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <MarketMoodIndicator value={72} />
            <Glossary variant="compact" />
            <PriceComparison />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
