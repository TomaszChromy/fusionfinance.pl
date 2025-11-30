"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ForexSection from "@/components/sections/ForexSection";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";

const currencyRates = [
  { code: "EUR/PLN", name: "Euro", rate: "4.3125", change: "+0.15%", flag: "🇪🇺" },
  { code: "USD/PLN", name: "Dolar amerykański", rate: "4.0234", change: "-0.08%", flag: "🇺🇸" },
  { code: "GBP/PLN", name: "Funt brytyjski", rate: "5.0890", change: "+0.23%", flag: "🇬🇧" },
  { code: "CHF/PLN", name: "Frank szwajcarski", rate: "4.5678", change: "+0.12%", flag: "🇨🇭" },
  { code: "JPY/PLN", name: "Jen japoński", rate: "0.0268", change: "-0.05%", flag: "🇯🇵" },
  { code: "CZK/PLN", name: "Korona czeska", rate: "0.1734", change: "+0.02%", flag: "🇨🇿" },
  { code: "NOK/PLN", name: "Korona norweska", rate: "0.3654", change: "-0.11%", flag: "🇳🇴" },
  { code: "SEK/PLN", name: "Korona szwedzka", rate: "0.3789", change: "+0.08%", flag: "🇸🇪" },
  { code: "DKK/PLN", name: "Korona duńska", rate: "0.5782", change: "+0.05%", flag: "🇩🇰" },
  { code: "AUD/PLN", name: "Dolar australijski", rate: "2.6145", change: "-0.12%", flag: "🇦🇺" },
  { code: "CAD/PLN", name: "Dolar kanadyjski", rate: "2.9567", change: "+0.09%", flag: "🇨🇦" },
  { code: "HUF/PLN", name: "Forint węgierski", rate: "0.0108", change: "-0.03%", flag: "🇭🇺" },
  { code: "CNY/PLN", name: "Juan chiński", rate: "0.5523", change: "+0.07%", flag: "🇨🇳" },
  { code: "TRY/PLN", name: "Lira turecka", rate: "0.1178", change: "-0.45%", flag: "🇹🇷" },
  { code: "RUB/PLN", name: "Rubel rosyjski", rate: "0.0401", change: "-0.22%", flag: "🇷🇺" },
  { code: "UAH/PLN", name: "Hrywna ukraińska", rate: "0.0973", change: "+0.04%", flag: "🇺🇦" },
];

// Lista walut do przelicznika
const currencies = [
  { code: "PLN", name: "Złoty polski", flag: "🇵🇱" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "USD", name: "Dolar amerykański", flag: "🇺🇸" },
  { code: "GBP", name: "Funt brytyjski", flag: "🇬🇧" },
  { code: "CHF", name: "Frank szwajcarski", flag: "🇨🇭" },
  { code: "JPY", name: "Jen japoński", flag: "🇯🇵" },
  { code: "CZK", name: "Korona czeska", flag: "🇨🇿" },
  { code: "NOK", name: "Korona norweska", flag: "🇳🇴" },
  { code: "SEK", name: "Korona szwedzka", flag: "🇸🇪" },
  { code: "DKK", name: "Korona duńska", flag: "🇩🇰" },
  { code: "AUD", name: "Dolar australijski", flag: "🇦🇺" },
  { code: "CAD", name: "Dolar kanadyjski", flag: "🇨🇦" },
  { code: "HUF", name: "Forint węgierski", flag: "🇭🇺" },
  { code: "CNY", name: "Juan chiński", flag: "🇨🇳" },
  { code: "TRY", name: "Lira turecka", flag: "🇹🇷" },
  { code: "RUB", name: "Rubel rosyjski", flag: "🇷🇺" },
  { code: "UAH", name: "Hrywna ukraińska", flag: "🇺🇦" },
];

export default function WalutyPage() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("PLN");

  const getRate = useMemo(() => (from: string, to: string): number => {
    if (from === to) return 1;

    // Znajdź kursy względem PLN
    const fromToPLN = from === "PLN" ? 1 : parseFloat(currencyRates.find(r => r.code === `${from}/PLN`)?.rate || "1");
    const toToPLN = to === "PLN" ? 1 : parseFloat(currencyRates.find(r => r.code === `${to}/PLN`)?.rate || "1");

    // Przelicz przez PLN
    return fromToPLN / toToPLN;
  }, []);

  const result = (amount * getRate(fromCurrency, toCurrency)).toFixed(4);

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
            <div className="w-[55px] h-[3px] bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] rounded-full" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5] mb-[13px]">Waluty i kursy FOREX</h1>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl leading-relaxed">
            Aktualne kursy walut NBP, przelicznik walut i notowania rynku FOREX
          </p>
        </motion.div>

        {/* Currency table */}
        <div className="bg-[#0f1115] border border-[#c9a962]/10 rounded-lg overflow-hidden mb-[55px]">
          <div className="p-[21px] border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Kursy średnie NBP</h2>
            </div>
            <span className="text-[11px] text-[#71717a]">Aktualizacja: dziś, 12:00</span>
          </div>
          <table className="w-full">
            <thead className="bg-[#08090c]">
              <tr>
                <th className="text-left text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Waluta</th>
                <th className="text-left text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Nazwa</th>
                <th className="text-right text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Kurs</th>
                <th className="text-right text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Zmiana</th>
              </tr>
            </thead>
            <tbody>
              {currencyRates.map((currency) => (
                <tr key={currency.code} className="border-t border-white/5 hover:bg-[#c9a962]/5 transition-colors duration-300">
                  <td className="px-[21px] py-[13px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[18px]">{currency.flag}</span>
                      <span className="text-[14px] font-medium text-[#c9a962]">{currency.code}</span>
                    </div>
                  </td>
                  <td className="px-[21px] py-[13px] text-[13px] text-[#f4f4f5]">{currency.name}</td>
                  <td className="px-[21px] py-[13px] text-[14px] text-[#f4f4f5] text-right font-mono">{currency.rate} PLN</td>
                  <td className={`px-[21px] py-[13px] text-[13px] text-right font-medium ${currency.change.startsWith("+") ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {currency.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Golden ratio grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[61.8fr_38.2fr] gap-[34px]">
          <div>
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Wiadomości walutowe</h2>
            </div>
            <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
              <RSSArticlesPaginated feedType="waluty" totalArticles={80} articlesPerPage={10} />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Przelicznik walut</h2>
            </div>
            <div className="bg-[#0f1115] border border-[#c9a962]/10 rounded-lg p-[21px]">
              <div className="space-y-[21px]">
                <div>
                  <label htmlFor="amount" className="block text-[11px] text-[#71717a] mb-[8px] uppercase tracking-[0.1em]">Kwota</label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Wprowadź kwotę"
                    className="w-full px-[13px] py-[13px] bg-[#08090c] border border-white/10 rounded-lg text-[#f4f4f5] focus:outline-none focus:border-[#c9a962]/50 transition-colors duration-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-[13px]">
                  <div>
                    <label htmlFor="fromCurrency" className="block text-[11px] text-[#71717a] mb-[8px] uppercase tracking-[0.1em]">Z waluty</label>
                    <select
                      id="fromCurrency"
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      title="Wybierz walutę źródłową"
                      className="w-full px-[13px] py-[13px] bg-[#08090c] border border-white/10 rounded-lg text-[#f4f4f5] focus:outline-none focus:border-[#c9a962]/50 transition-colors duration-300"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="toCurrency" className="block text-[11px] text-[#71717a] mb-[8px] uppercase tracking-[0.1em]">Na walutę</label>
                    <select
                      id="toCurrency"
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      title="Wybierz walutę docelową"
                      className="w-full px-[13px] py-[13px] bg-[#08090c] border border-white/10 rounded-lg text-[#f4f4f5] focus:outline-none focus:border-[#c9a962]/50 transition-colors duration-300"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Swap button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const temp = fromCurrency;
                      setFromCurrency(toCurrency);
                      setToCurrency(temp);
                    }}
                    className="p-[8px] bg-[#08090c] border border-white/10 rounded-full hover:border-[#c9a962]/50 transition-colors duration-300"
                    title="Zamień waluty"
                  >
                    <svg className="w-[18px] h-[18px] text-[#c9a962]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
                <div className="pt-[21px] text-center border-t border-white/5">
                  <p className="text-[#71717a] text-[11px] uppercase tracking-[0.1em] mb-[8px]">Wynik:</p>
                  <p className="text-[28px] font-medium text-[#c9a962]">
                    {result} <span className="text-[18px] text-[#f4f4f5]">{toCurrency}</span>
                  </p>
                  <p className="text-[11px] text-[#71717a] mt-[8px]">
                    1 {fromCurrency} = {getRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#f7931a] to-[#f59e0b] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Pary walutowe</h2>
              </div>
              <ForexSection />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

