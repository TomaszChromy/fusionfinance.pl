"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import TradingViewChart from "@/components/TradingViewChart";
import Footer from "@/components/Footer";

type Stock = {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePct: number;
};

export default function MarketsPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "changePct">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Load stock data from backend API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/stocks");
        const data = await res.json();
        setStocks(data.items ?? []);
      } catch (err) {
        console.error("Markets fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter + Sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    let list = stocks.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.symbol.toLowerCase().includes(q)
    );

    list = list.sort((a, b) => {
      let cmp = 0;

      if (sortBy === "name") {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = (a.changePct ?? 0) - (b.changePct ?? 0);
      }

      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [stocks, search, sortBy, sortDir]);

  function toggleSort(by: "name" | "changePct") {
    if (sortBy === by) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(by);
      setSortDir("desc");
    }
  }

  return (
    <main className="min-h-screen bg-transparent text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-16 md:pt-28">
        {/* HEADER / HERO */}
        <section className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80"
          >
            Global Markets
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-2 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Giełdy – globalne indeksy rynków światowych
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base"
          >
            Przegląd indeksów z USA, Europy, Azji i rynków wschodzących.
            Filtruj po nazwie lub symbolu i sortuj po zmianie procentowej,
            aby szybko zobaczyć, gdzie rynki są dzisiaj najbardziej aktywne.
          </motion.p>
        </section>

        {/* CARD: INDEX TABLE */}
        <section className="rounded-3xl bg-gradient-to-b from-[#0b1020] to-[#050816] p-6 shadow-2xl ring-1 ring-slate-800/60">
          {/* FILTERS */}
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Szukaj indeksu (np. S&P, DAX, WIG20)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-sky-500 md:max-w-sm"
            />

            <div className="flex gap-2 text-xs">
              <button
                onClick={() => toggleSort("name")}
                className={`rounded-full px-3 py-1.5 ring-1 ${
                  sortBy === "name"
                    ? "bg-sky-600/70 ring-sky-400 text-white"
                    : "bg-slate-900/70 ring-slate-700 text-slate-200"
                }`}
              >
                Sortuj: Nazwa{" "}
                {sortBy === "name" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>

              <button
                onClick={() => toggleSort("changePct")}
                className={`rounded-full px-3 py-1.5 ring-1 ${
                  sortBy === "changePct"
                    ? "bg-sky-600/70 ring-sky-400 text-white"
                    : "bg-slate-900/70 ring-slate-700 text-slate-200"
                }`}
              >
                Sortuj: Zmiana %{" "}
                {sortBy === "changePct" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <p className="text-xs text-slate-400">Ładowanie indeksów…</p>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="text-[11px] text-slate-400">
                  <tr>
                    <th className="text-left">Nazwa</th>
                    <th className="text-left">Symbol</th>
                    <th className="text-right">Wartość</th>
                    <th className="text-right">Zmiana</th>
                    <th className="text-right">Zmiana %</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((i) => (
                    <tr key={i.symbol}>
                      <td className="rounded-l-xl bg-slate-900/40 px-3 py-2">
                        {i.name}
                      </td>
                      <td className="bg-slate-900/40 px-3 py-2">{i.symbol}</td>
                      <td className="bg-slate-900/40 px-3 py-2 text-right">
                        {i.value?.toFixed?.(2) ?? "-"}
                      </td>
                      <td className="bg-slate-900/40 px-3 py-2 text-right">
                        {i.change?.toFixed?.(2) ?? "-"}
                      </td>
                      <td className="rounded-r-xl bg-slate-900/40 px-3 py-2 text-right">
                        {i.changePct?.toFixed?.(2) ?? "-"}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <p className="mt-3 text-xs text-slate-500">
                  Brak indeksów spełniających kryteria wyszukiwania.
                </p>
              )}
            </div>
          )}
        </section>

        {/* TRADINGVIEW CHART */}
        <TradingViewChart symbol="SP:SPX" />

        {/* FOOTER */}
        <Footer />
      </div>
    </main>
  );
}
