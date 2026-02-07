"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface Currency {
  code: string;
  name: string;
  flag?: string;
}

const CURRENCIES: Currency[] = [
  { code: "PLN", name: "Polski złoty", flag: "🇵🇱" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "USD", name: "Dolar amerykański", flag: "🇺🇸" },
  { code: "GBP", name: "Funt brytyjski", flag: "🇬🇧" },
  { code: "CHF", name: "Frank szwajcarski", flag: "🇨🇭" },
  { code: "JPY", name: "Jen japoński", flag: "🇯🇵" },
  { code: "CZK", name: "Korona czeska", flag: "🇨🇿" },
  { code: "NOK", name: "Korona norweska", flag: "🇳🇴" },
];

const MOCK_RATES: Record<string, number> = {
  PLN: 1,
  EUR: 4.32,
  USD: 3.95,
  GBP: 5.02,
  CHF: 4.46,
  JPY: 0.027,
  CZK: 0.18,
  NOK: 0.35,
};

interface CurrencyConverterProps {
  className?: string;
}

const CurrencySelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f4f4f5] focus:border-[#c9a962]/50 outline-none cursor-pointer"
  >
    {CURRENCIES.map((c) => (
      <option key={c.code} value={c.code}>
        {c.flag} {c.code}
      </option>
    ))}
  </select>
);

export default function CurrencyConverter({ className = "" }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState("PLN");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rates, setRates] = useState<Record<string, number>>(MOCK_RATES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/forex?symbols=PLN,EUR,USD,GBP,CHF,JPY,CZK,NOK", { cache: "no-store" });
        const data = await res.json();
        if (isMounted && data?.rates) {
          setRates(prev => ({ ...prev, ...data.rates }));
        }
      } catch (error) {
        console.error("Forex fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);
  const result = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    const fromRate = rates[fromCurrency] ?? 1;
    const toRate = rates[toCurrency] ?? 1;
    const amountInPln = numAmount * fromRate; // rates are wyrażone w PLN
    return amountInPln / toRate;
  }, [amount, fromCurrency, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <h3 className="text-sm font-medium text-[#f4f4f5]">Kalkulator walut</h3>
      </div>

      {/* From */}
      <div className="mb-3">
        <label className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1.5 block">Kwota</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-lg font-medium text-[#f4f4f5] focus:border-[#c9a962]/50 outline-none"
            placeholder="0.00"
          />
          <CurrencySelect value={fromCurrency} onChange={setFromCurrency} />
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-2">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={swapCurrencies}
          className="w-10 h-10 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/30 flex items-center justify-center text-[#c9a962] hover:bg-[#c9a962]/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </motion.button>
      </div>

      {/* To */}
      <div className="mb-4">
        <label className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1.5 block">Wynik {loading ? "(ładowanie kursów...)" : ""}</label>
        <div className="flex gap-2">
          <div className="flex-1 bg-[#08090c] border border-white/10 rounded-lg px-3 py-2">
            <motion.span
              key={result}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold text-[#c9a962]"
            >
              {result.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </motion.span>
          </div>
          <CurrencySelect value={toCurrency} onChange={setToCurrency} />
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="text-center text-xs text-[#52525b]">
        1 {fromCurrency} = {(rates[fromCurrency] && rates[toCurrency] ? (rates[fromCurrency] / rates[toCurrency]) : 1).toFixed(4)} {toCurrency}
      </div>
    </div>
  );
}
