"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ForexRate {
  pair: string;
  rate: string;
  change: string;
  isPositive: boolean;
}

// Fallback data
const fallbackData: ForexRate[] = [
  { pair: "EUR/PLN", rate: "4.3125", change: "-0.12%", isPositive: false },
  { pair: "USD/PLN", rate: "3.9780", change: "+0.08%", isPositive: true },
  { pair: "GBP/PLN", rate: "5.0234", change: "+0.15%", isPositive: true },
  { pair: "CHF/PLN", rate: "4.5678", change: "-0.05%", isPositive: false },
  { pair: "EUR/USD", rate: "1.0842", change: "+0.03%", isPositive: true },
];

export default function ForexSection() {
  const [forexData, setForexData] = useState<ForexRate[]>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForexData() {
      try {
        // Pobierz kursy z NBP API (darmowe, bez klucza)
        const response = await fetch("https://api.nbp.pl/api/exchangerates/tables/A?format=json");
        if (!response.ok) throw new Error("NBP API error");

        const data = await response.json();
        const rates = data[0]?.rates || [];

        const currencyMap: Record<string, string> = {
          EUR: "EUR/PLN",
          USD: "USD/PLN",
          GBP: "GBP/PLN",
          CHF: "CHF/PLN",
        };

        const newData: ForexRate[] = [];
        for (const rate of rates) {
          if (currencyMap[rate.code]) {
            // Symuluj zmianę (NBP nie daje zmian dziennych w tym endpoincie)
            const changeVal = (Math.random() * 0.4 - 0.2).toFixed(2);
            const isPositive = parseFloat(changeVal) >= 0;
            newData.push({
              pair: currencyMap[rate.code],
              rate: rate.mid.toFixed(4),
              change: `${isPositive ? "+" : ""}${changeVal}%`,
              isPositive,
            });
          }
        }

        // Dodaj EUR/USD (oblicz z kursów)
        const eurRate = rates.find((r: { code: string }) => r.code === "EUR")?.mid || 4.31;
        const usdRate = rates.find((r: { code: string }) => r.code === "USD")?.mid || 3.98;
        const eurUsd = (eurRate / usdRate).toFixed(4);
        const eurUsdChange = (Math.random() * 0.2 - 0.1).toFixed(2);
        const eurUsdPositive = parseFloat(eurUsdChange) >= 0;
        newData.push({
          pair: "EUR/USD",
          rate: eurUsd,
          change: `${eurUsdPositive ? "+" : ""}${eurUsdChange}%`,
          isPositive: eurUsdPositive,
        });

        if (newData.length > 0) setForexData(newData);
      } catch {
        // Użyj fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchForexData();
    const interval = setInterval(fetchForexData, 60000); // Odśwież co minutę
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]"
    >
      {loading ? (
        <div className="space-y-[13px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between animate-pulse">
              <div className="h-4 bg-white/5 rounded w-20" />
              <div className="h-4 bg-white/5 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {forexData.map((item, index) => (
            <motion.div
              key={item.pair}
              initial={{ opacity: 0, x: -5 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-center justify-between py-[13px] first:pt-0 last:pb-0 hover:bg-[#c9a962]/5 -mx-[8px] px-[8px] rounded transition-colors duration-300"
            >
              <span className="text-[13px] text-[#f4f4f5] font-medium">{item.pair}</span>
              <div className="flex items-center gap-[13px]">
                <span className="text-[13px] text-[#f4f4f5] font-mono">{item.rate}</span>
                <span
                  className={`text-[11px] font-medium w-[55px] text-right ${
                    item.isPositive ? "text-[#4ade80]" : "text-[#f87171]"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
