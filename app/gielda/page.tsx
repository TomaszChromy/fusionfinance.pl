"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { CategoryBadge } from "@/components/Badge";
import HeatMap from "@/components/HeatMap";
import TrendIndicator from "@/components/TrendIndicator";
import StockTicker from "@/components/StockTicker";
import TradingViewChart from "@/components/TradingViewChart";

export default function GieldaPage() {
  const headlineTickers = [
    { symbol: "WIG20", name: "Warszawa", price: 2543.2, change: 12.4, changePercent: 0.49 },
    { symbol: "mWIG40", name: "MidCap", price: 6123.5, change: -21.3, changePercent: -0.35 },
    { symbol: "sWIG80", name: "SmallCap", price: 22345.1, change: 54.2, changePercent: 0.24 },
    { symbol: "DAX", name: "Frankfurt", price: 18874.3, change: -32.1, changePercent: -0.17 },
    { symbol: "S&P 500", name: "USA", price: 5174.9, change: 15.8, changePercent: 0.31 },
    { symbol: "NASDAQ", name: "USA", price: 18943.4, change: 82.4, changePercent: 0.44 },
    { symbol: "CAC40", name: "Paryż", price: 7522.1, change: -12.4, changePercent: -0.16 },
    { symbol: "FTSE100", name: "Londyn", price: 7643.2, change: 9.8, changePercent: 0.13 },
  ];

  const heatmapData = [
    { id: "pko", symbol: "PKO", name: "PKO BP", change: 1.8, value: 47.2, size: 54 },
    { id: "pzu", symbol: "PZU", name: "PZU", change: -0.9, value: 42.1, size: 50 },
    { id: "cdr", symbol: "CDR", name: "CD Projekt", change: 4.4, value: 148.3, size: 48 },
    { id: "peo", symbol: "PEO", name: "Pekao", change: 0.6, value: 126.5, size: 40 },
    { id: "dnp", symbol: "DNP", name: "Dino", change: 2.1, value: 388.2, size: 46 },
    { id: "kgh", symbol: "KGH", name: "KGHM", change: -2.7, value: 143.1, size: 44 },
    { id: "opl", symbol: "OPL", name: "Orange", change: 0.4, value: 8.25, size: 28 },
    { id: "lpp", symbol: "LPP", name: "LPP", change: 3.1, value: 12480, size: 52 },
    { id: "spl", symbol: "SPL", name: "Santander", change: -0.6, value: 381.5, size: 42 },
    { id: "ale", symbol: "ALE", name: "Allegro", change: 1.2, value: 34.6, size: 40 },
    { id: "cps", symbol: "CPS", name: "Cyfrowy PL", change: -3.1, value: 24.4, size: 34 },
    { id: "jsw", symbol: "JSW", name: "JSW", change: -4.1, value: 27.9, size: 30 },
    { id: "pgn", symbol: "PGN", name: "PGNiG", change: 0.9, value: 6.4, size: 26 },
    { id: "mbk", symbol: "MBK", name: "mBank", change: 2.6, value: 600.2, size: 46 },
    { id: "plt", symbol: "PLT", name: "Play", change: -1.4, value: 31.8, size: 32 },
    { id: "asz", symbol: "ASZ", name: "Asseco", change: 1.1, value: 88.5, size: 38 },
  ];

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 py-[34px]">
        <Breadcrumbs />
        <PageHero
          title="Giełda"
          subtitle="GPW i globalne parkiety: WIG20, mWIG40, sWIG80, dywidendy, IPO i debiuty."
          eyebrow="GPW & świat"
          badge="Live"
          accentFrom="#4ade80"
          accentTo="#22c55e"
          rightSlot={<CategoryBadge category="gielda" />}
        />

        <div className="space-y-8 lg:space-y-10">
          <div className="bg-[#0c0d10] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-1 h-7 bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
              <div>
                <h2 className="text-lg font-serif font-medium text-[#f4f4f5]">Notowania giełdowe</h2>
                <p className="text-xs text-[#71717a]">GPW + główne indeksy światowe</p>
              </div>
            </div>
            <StockTicker items={headlineTickers} speed={45} variant="detailed" className="bg-[#0c0d10]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
              <TradingViewChart symbol="GPW:WIG20" height={320} />
              <TradingViewChart symbol="SP:SPX" height={320} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <HeatMap title="Mapa ciepła WIG20" data={heatmapData} className="shadow-[0_30px_80px_-50px_rgba(0,0,0,0.5)]" />

            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
                <h3 className="text-xs font-semibold text-[#f4f4f5] uppercase tracking-[0.1em] flex items-center gap-2">
                  <span>📊</span> Trendy indeksów
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TrendIndicator direction="up" strength="moderate" label="WIG20" value="+0.49%" />
                <TrendIndicator direction="down" strength="weak" label="mWIG40" value="-0.35%" />
                <TrendIndicator direction="up" strength="strong" label="S&P 500" value="+0.31%" />
                <TrendIndicator direction="down" strength="moderate" label="NASDAQ" value="-0.22%" />
                <TrendIndicator direction="up" strength="weak" label="DAX" value="+0.12%" />
                <TrendIndicator direction="down" strength="weak" label="CAC40" value="-0.18%" />
                <TrendIndicator direction="up" strength="moderate" label="NIKKEI" value="+0.66%" />
                <TrendIndicator direction="up" strength="strong" label="HSI" value="+1.08%" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
