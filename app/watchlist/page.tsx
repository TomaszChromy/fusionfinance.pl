"use client";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  type: string;
  createdAt: string;
}

export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ symbol: "", name: "", type: "stock" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/logowanie");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) fetchWatchlist();
  }, [session]);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ symbol: "", name: "", type: "stock" });
        setShowForm(false);
        fetchWatchlist();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (symbol: string) => {
    try {
      await fetch(`/api/watchlist?symbol=${symbol}`, { method: "DELETE" });
      setItems(items.filter(i => i.symbol !== symbol));
    } catch (error) {
      console.error(error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stock": return "📈";
      case "crypto": return "₿";
      case "currency": return "💱";
      case "index": return "📊";
      default: return "📌";
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#08090c]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <div className="mx-auto max-w-4xl px-5 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-medium text-[#f4f4f5]">👁️ Watchlist</h1>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-gradient-to-r from-[#c9a962] to-[#b8943d] text-[#08090c] font-medium rounded-lg text-sm">
            + Dodaj
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="bg-[#0c0d10] border border-white/5 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="Symbol (np. AAPL)" value={formData.symbol} onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]" required />
                <input type="text" placeholder="Nazwa (opcjonalnie)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]" />
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5]">
                  <option value="stock">Akcje</option>
                  <option value="crypto">Kryptowaluta</option>
                  <option value="currency">Waluta</option>
                  <option value="index">Indeks</option>
                </select>
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

