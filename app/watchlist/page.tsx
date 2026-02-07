"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveIndicator from "@/components/LiveIndicator";

type ItemType = "stock" | "crypto" | "currency" | "index";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  type: ItemType;
  createdAt: string;
  note?: string;
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ symbol: "", name: "", type: "stock" as ItemType, note: "" });

  // sync z backendem, fallback do lokalnego stanu gdy 500/401
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch("/api/watchlist");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
          return;
        }
      } catch {
        // seed fallback
        setItems([
          { id: "seed1", symbol: "WIG20", name: "Warszawa", type: "index", createdAt: new Date().toISOString() },
          { id: "seed2", symbol: "BTC", name: "Bitcoin", type: "crypto", createdAt: new Date().toISOString() },
          { id: "seed3", symbol: "EUR/PLN", name: "Euro/Złoty", type: "currency", createdAt: new Date().toISOString() },
          { id: "seed4", symbol: "AAPL", name: "Apple", type: "stock", createdAt: new Date().toISOString() },
        ]);
      }
    };
    sync();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symbol) return;
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("create failed");
      const item = await res.json();
      setItems(prev => [item, ...prev]);
    } catch {
      const item: WatchlistItem = {
        id: crypto.randomUUID(),
        symbol: formData.symbol.toUpperCase(),
        name: formData.name || formData.symbol.toUpperCase(),
        type: formData.type,
        note: formData.note,
        createdAt: new Date().toISOString(),
      };
      setItems(prev => [item, ...prev]);
    }
    setFormData({ symbol: "", name: "", type: "stock", note: "" });
    setShowForm(false);
  };

  const handleDelete = async (symbol: string) => {
    try {
      await fetch(`/api/watchlist?symbol=${symbol}`, { method: "DELETE" });
    } catch { /* ignore */ }
    setItems(prev => prev.filter(i => i.symbol !== symbol));
  };

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case "stock": return "📈";
      case "crypto": return "₿";
      case "currency": return "💱";
      case "index": return "📊";
      default: return "📌";
    }
  };

  const counts = useMemo(() => ({
    stock: items.filter(i => i.type === "stock").length,
    crypto: items.filter(i => i.type === "crypto").length,
    currency: items.filter(i => i.type === "currency").length,
    index: items.filter(i => i.type === "index").length,
  }), [items]);

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-5 py-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#71717a]">Watchlist</p>
            <h1 className="text-3xl font-serif font-medium text-[#f4f4f5] flex items-center gap-2">
              👁️ Twoje rynki <LiveIndicator label="Na żywo" />
            </h1>
            <p className="text-sm text-[#71717a] mt-1">Akcje, indeksy, krypto, FX – szybkie podglądy jak w aplikacjach brokerskich.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a1a1aa] bg-white/5 px-3 py-1 rounded-full">
              {counts.stock} akcji · {counts.crypto} krypto · {counts.currency} FX · {counts.index} indeksów
            </span>
            <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-gradient-to-r from-[#c9a962] to-[#b8943d] text-[#08090c] font-medium rounded-lg text-sm">
              + Dodaj
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="bg-[#0c0d10] border border-white/5 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input type="text" placeholder="Ticker (AAPL, BTC, EUR/PLN)" value={formData.symbol} onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]" required />
                <input type="text" placeholder="Nazwa (opcjonalnie)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]" />
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as ItemType })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5]">
                  <option value="stock">Akcje</option>
                  <option value="crypto">Kryptowaluta</option>
                  <option value="currency">Waluta</option>
                  <option value="index">Indeks</option>
                </select>
                <input
                  type="text"
                  placeholder="Notatka (setup, poziom, sektor)"
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]"
                />
              </div>
              <button type="submit" className="mt-4 px-6 py-2 bg-[#c9a962] text-[#08090c] font-medium rounded-lg">Dodaj do listy</button>
            </motion.form>
          )}
        </AnimatePresence>

        {items.length === 0 ? (
          <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-12 text-center">
            <p className="text-[#71717a]">Twoja lista obserwowanych jest pusta</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0c0d10] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-[#c9a962]/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getTypeIcon(item.type)}</span>
                  <div>
                    <p className="font-medium text-[#f4f4f5]">{item.symbol}</p>
                    <p className="text-xs text-[#71717a]">{item.name || item.type}</p>
                    {item.note && <p className="text-[11px] text-[#c9a962]">{item.note}</p>}
                    <p className="text-[10px] text-[#52525b]">Dodano: {new Date(item.createdAt).toLocaleDateString("pl-PL")}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(item.symbol)} className="p-2 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
