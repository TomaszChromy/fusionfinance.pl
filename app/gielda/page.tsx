"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StocksSection from "@/components/sections/StocksSection";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";

const gpwCompanies = [
  { symbol: "KGHM", name: "KGHM Polska Miedź", price: "142.50", change: "+2.35%", sector: "Surowce" },
  { symbol: "PKO", name: "PKO Bank Polski", price: "58.20", change: "+0.87%", sector: "Banki" },
  { symbol: "CDR", name: "CD Projekt", price: "118.40", change: "-1.24%", sector: "Gaming" },
  { symbol: "PKN", name: "PKN Orlen", price: "68.90", change: "+1.56%", sector: "Energia" },
  { symbol: "PZU", name: "PZU SA", price: "45.30", change: "+0.44%", sector: "Ubezpieczenia" },
  { symbol: "ALE", name: "Allegro.eu", price: "32.80", change: "-0.91%", sector: "E-commerce" },
  { symbol: "DNP", name: "Dino Polska", price: "412.00", change: "+1.82%", sector: "Handel" },
  { symbol: "LPP", name: "LPP SA", price: "15420", change: "+0.65%", sector: "Odzież" },
];

export default function GieldaPage() {
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
            <div className="w-[55px] h-[3px] bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-full" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5] mb-[13px]">Giełda Papierów Wartościowych</h1>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl leading-relaxed">
            Notowania spółek GPW, indeksy giełdowe, analizy techniczne i fundamentalne
          </p>
        </motion.div>

        <StocksSection />

        {/* Golden ratio grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[61.8fr_38.2fr] gap-[34px] mt-[55px]">
          <div>
            {/* Popularne spółki GPW */}
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Popularne spółki GPW</h2>
            </div>
            <div className="bg-[#0f1115] border border-[#c9a962]/10 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#08090c]">
                  <tr>
                    <th className="text-left text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Symbol</th>
                    <th className="text-left text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Nazwa</th>
                    <th className="text-right text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Kurs</th>
                    <th className="text-right text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Zmiana</th>
                    <th className="text-left text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em] hidden md:table-cell">Sektor</th>
                  </tr>
                </thead>
                <tbody>
                  {gpwCompanies.map((company) => (
                    <tr key={company.symbol} className="border-t border-white/5 hover:bg-[#c9a962]/5 cursor-pointer transition-colors duration-300">
                      <td className="px-[21px] py-[13px] text-[14px] font-medium text-[#c9a962]">{company.symbol}</td>
                      <td className="px-[21px] py-[13px] text-[13px] text-[#f4f4f5]">{company.name}</td>
                      <td className="px-[21px] py-[13px] text-[14px] text-[#f4f4f5] text-right font-mono">{company.price} PLN</td>
                      <td className={`px-[21px] py-[13px] text-[13px] text-right font-medium ${company.change.startsWith("+") ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                        {company.change}
                      </td>
                      <td className="px-[21px] py-[13px] text-[12px] text-[#71717a] hidden md:table-cell">{company.sector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Wiadomości */}
            <div className="mt-[55px] pt-[34px] border-t border-white/5">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Wiadomości giełdowe</h2>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
                <RSSArticlesPaginated feedType="gielda" totalArticles={80} articlesPerPage={10} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Indeksy GPW */}
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Indeksy GPW</h2>
            </div>
            <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px] space-y-[13px]">
              {[
                { name: "WIG20", value: "2456.78", change: "+1.24%" },
                { name: "WIG", value: "78234.56", change: "+0.89%" },
                { name: "mWIG40", value: "5678.90", change: "+0.45%" },
                { name: "sWIG80", value: "21345.67", change: "-0.12%" },
              ].map((index) => (
                <div key={index.name} className="flex justify-between items-center pb-[13px] border-b border-white/5 last:border-0 last:pb-0">
                  <span className="text-[14px] font-medium text-[#f4f4f5]">{index.name}</span>
                  <div className="text-right">
                    <span className="text-[14px] text-[#f4f4f5] font-mono">{index.value}</span>
                    <span className={`text-[12px] ml-2 ${index.change.startsWith("+") ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                      {index.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Statystyki sesji */}
            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#f7931a] to-[#f59e0b] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Statystyki sesji</h2>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px] space-y-[13px]">
                <div className="flex justify-between pb-[13px] border-b border-white/5"><span className="text-[#a1a1aa]">Obrót:</span><span className="text-[#f4f4f5] font-medium">1.24 mld PLN</span></div>
                <div className="flex justify-between pb-[13px] border-b border-white/5"><span className="text-[#a1a1aa]">Wzrosty:</span><span className="text-[#4ade80] font-medium">234 spółki</span></div>
                <div className="flex justify-between pb-[13px] border-b border-white/5"><span className="text-[#a1a1aa]">Spadki:</span><span className="text-[#f87171] font-medium">156 spółek</span></div>
                <div className="flex justify-between"><span className="text-[#a1a1aa]">Bez zmian:</span><span className="text-[#f4f4f5] font-medium">45 spółek</span></div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

