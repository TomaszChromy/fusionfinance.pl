"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";

const categories = [
  { name: "Wszystkie", id: "all", active: true },
  { name: "Forex", id: "forex" },
  { name: "Analiza Techniczna", id: "technical" },
  { name: "Analiza Fundamentalna", id: "fundamental" },
  { name: "Przegląd Rynku", id: "overview" },
];

export default function AnalizyPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-[34px]">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-[34px]"
        >
          <div className="flex items-center gap-3 mb-[13px]">
            <div className="w-[55px] h-[3px] bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] rounded-full" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5] mb-[13px]">Analizy rynkowe</h1>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl leading-relaxed">
            Eksperckie analizy rynku Forex, prognozy walutowe i komentarze dotyczące aktualnej sytuacji na rynkach finansowych
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-[8px] mb-[34px]">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className={`px-[21px] py-[8px] rounded-full text-[12px] font-medium transition-all duration-300 ${
                cat.active
                  ? "bg-[#c9a962] text-[#08090c]"
                  : "bg-[#0f1115] text-[#a1a1aa] border border-white/10 hover:border-[#c9a962]/50 hover:text-[#c9a962]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Golden ratio grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[61.8fr_38.2fr] gap-[34px]">
          <div>
            {/* Analizy Forex */}
            <div>
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Analizy Forex</h2>
                <span className="px-[13px] py-[5px] bg-[#4ade80]/10 text-[#4ade80] text-[10px] font-medium rounded-full uppercase tracking-wider">
                  Investing.com
                </span>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
                <RSSArticlesPaginated feedType="analizy" totalArticles={80} articlesPerPage={10} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Pary walutowe */}
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Popularne pary walutowe</h2>
            </div>
            <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
              <div className="space-y-[13px]">
                {[
                  { pair: "EUR/USD", trend: "↑", change: "+0.12%" },
                  { pair: "GBP/USD", trend: "↓", change: "-0.08%" },
                  { pair: "USD/JPY", trend: "↑", change: "+0.23%" },
                  { pair: "USD/CHF", trend: "↓", change: "-0.05%" },
                  { pair: "EUR/PLN", trend: "↑", change: "+0.15%" },
                  { pair: "USD/PLN", trend: "↑", change: "+0.18%" },
                  { pair: "GBP/PLN", trend: "↓", change: "-0.04%" },
                  { pair: "CHF/PLN", trend: "↑", change: "+0.09%" },
                ].map((item) => (
                  <div key={item.pair} className="flex justify-between items-center pb-[13px] border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-[14px] text-[#f4f4f5] font-medium">{item.pair}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] font-medium ${item.trend === "↑" ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                        {item.trend} {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tematy analiz */}
            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Tematy analiz</h2>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
                <div className="space-y-[13px]">
                  {[
                    { tag: "#EUR/USD", count: 156 },
                    { tag: "#Fed", count: 134 },
                    { tag: "#EBC", count: 98 },
                    { tag: "#Dolar", count: 87 },
                    { tag: "#StopyProcentowe", count: 76 },
                    { tag: "#Inflacja", count: 65 },
                    { tag: "#NBP", count: 54 },
                    { tag: "#Złoty", count: 43 },
                  ].map((topic) => (
                    <div key={topic.tag} className="flex justify-between items-center pb-[13px] border-b border-white/5 last:border-0 last:pb-0">
                      <span className="text-[14px] text-[#c9a962] hover:text-[#e4d4a5] cursor-pointer transition-colors duration-300">{topic.tag}</span>
                      <span className="text-[11px] text-[#71717a]">{topic.count} analiz</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Newsletter</h2>
              </div>
              <div className="bg-gradient-to-br from-[#0f1115] to-[#15181e] border border-[#c9a962]/10 rounded-lg p-[21px]">
                <p className="text-[14px] text-[#a1a1aa] mb-[21px] leading-relaxed">
                  Otrzymuj codzienne podsumowanie najważniejszych wiadomości finansowych
                </p>
                <input
                  type="email"
                  placeholder="Twój adres e-mail"
                  className="w-full px-[13px] py-[13px] bg-[#08090c] border border-white/10 rounded-lg text-[#f4f4f5] text-[14px] focus:outline-none focus:border-[#c9a962]/50 mb-[13px] transition-colors duration-300"
                />
                <button type="button" className="w-full px-[21px] py-[13px] bg-[#c9a962] text-[#08090c] rounded-lg font-medium hover:bg-[#e4d4a5] transition-colors duration-300">
                  Zapisz się
                </button>
              </div>
            </div>

            {/* Archiwum */}
            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Archiwum</h2>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px] space-y-[8px]">
                {["Listopad 2024", "Październik 2024", "Wrzesień 2024", "Sierpień 2024", "Lipiec 2024"].map((month) => (
                  <div key={month} className="flex justify-between items-center py-[8px] text-[13px] hover:text-[#c9a962] cursor-pointer transition-colors duration-300 group">
                    <span className="text-[#f4f4f5] group-hover:text-[#c9a962]">{month}</span>
                    <span className="text-[#71717a] group-hover:text-[#c9a962]">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

