"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { CategoryBadge } from "@/components/Badge";
import NBPCurrencyTable from "@/components/NBPCurrencyTable";
import CurrencyStrength from "@/components/CurrencyStrength";
import PriceComparison from "@/components/PriceComparison";

export default function WalutyPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 py-[34px]">
        <Breadcrumbs />
        <PageHero
          title="Waluty"
          subtitle="FX, PLN, EUR/USD, GBP, CHF – kursy, makro, hedging i nastroje na rynku walutowym."
          eyebrow="Forex & PLN"
          badge="Live"
          accentFrom="#60a5fa"
          accentTo="#3b82f6"
          rightSlot={<CategoryBadge category="waluty" />}
        />

        <div className="space-y-8 lg:space-y-10">
          <NBPCurrencyTable />

          <div className="grid gap-6 lg:grid-cols-2">
            <CurrencyStrength />
            <PriceComparison />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-[#0c0d10] via-[#0f131c] to-[#0c0d10] p-5 lg:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(96,165,250,0.12),transparent_38%)]" />
            <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#60a5fa]">FX alert</p>
                <h3 className="text-lg font-serif text-[#f4f4f5]">Ustaw progi na EUR/PLN, USD/PLN i inne pary</h3>
                <p className="text-sm text-[#a1a1aa] max-w-2xl">
                  Monitoruj ruchy PLN, dodaj pary walutowe do alertów i watchlisty. Powiadomienia lecą z naszego API bez konieczności logowania.
                </p>
              </div>
              <a
                href="/alerty/"
                className="px-4 py-2 rounded-lg bg-[#60a5fa] text-[#0b1220] text-sm font-semibold hover:brightness-110 transition"
              >
                Konfiguruj alert
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
