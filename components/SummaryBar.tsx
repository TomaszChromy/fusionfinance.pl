"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Summary = {
  articles: number;
  stocks: number;
  forex: number;
  crypto: number;
  lastUpdated: string | null;
};

export default function SummaryBar() {
  const [summary, setSummary] = useState<Summary>({
    articles: 0,
    stocks: 0,
    forex: 0,
    crypto: 0,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [rssRes, stocksRes, forexRes, cryptoRes] = await Promise.all([
          fetch("/api/rss"),
          fetch("/api/stocks"),
          fetch("/api/forex"),
          fetch("/api/crypto"),
        ]);

        const [rss, stocks, forex, crypto] = await Promise.all([
          rssRes.json(),
          stocksRes.json(),
          forexRes.json(),
          cryptoRes.json(),
        ]);

        setSummary({
          articles: rss.items?.length ?? 0,
          stocks: stocks.items?.length ?? 0,
          forex: forex.items?.length ?? 0,
          crypto: crypto.items?.length ?? 0,
          lastUpdated: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        console.error("Summary fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl bg-[#070c1b] px-4 py-4 shadow-2xl ring-1 ring-slate-800/70"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3 text-xs md:text-sm">
          <SummaryItem label="Artykuły" value={summary.articles} />
          <SummaryItem label="Indeksy" value={summary.stocks} />
          <SummaryItem label="Pary FX" value={summary.forex} />
          <SummaryItem label="Krypto" value={summary.crypto} />
        </div>

        <div className="text-[11px] text-slate-400 md:text-xs">
          {loading
            ? "Aktualizuję dane…"
            : summary.lastUpdated
            ? `Ostatnia aktualizacja: ${summary.lastUpdated}`
            : "Brak danych"}
        </div>
      </div>
    </motion.section>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-slate-900/70 px-3 py-2">
      <span className="text-[11px] text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-50">{value}</span>
    </div>
  );
}
