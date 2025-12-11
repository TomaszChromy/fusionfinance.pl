"use client";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Alert {
  id: string;
  symbol: string;
  condition: string;
  price: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: string;
}

export default function AlertsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ symbol: "", price: "", condition: "above" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/logowanie");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAlerts();
    }
  }, [session]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts");
      const data = await res.json();
      if (Array.isArray(data)) setAlerts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ symbol: "", price: "", condition: "above" });
        setShowForm(false);
        fetchAlerts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      setAlerts(alerts.map(a => a.id === id ? { ...a, isActive: !isActive } : a));
    } catch (error) {
      console.error(error);
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
          <h1 className="text-2xl font-serif font-medium text-[#f4f4f5]">🔔 Alerty cenowe</h1>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-gradient-to-r from-[#c9a962] to-[#b8943d] text-[#08090c] font-medium rounded-lg text-sm">
            + Nowy alert
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="bg-[#0c0d10] border border-white/5 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="Symbol (np. BTC)" value={formData.symbol} onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]" required />
                <select value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5]">
                  <option value="above">Powyżej</option>
                  <option value="below">Poniżej</option>
                </select>
                <input type="number" step="any" placeholder="Cena" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]" required />
              </div>
              <button type="submit" className="mt-4 px-6 py-2 bg-[#c9a962] text-[#08090c] font-medium rounded-lg">Dodaj alert</button>
            </motion.form>
          )}
        </AnimatePresence>

        {alerts.length === 0 ? (
          <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-12 text-center">
            <p className="text-[#71717a]">Nie masz jeszcze żadnych alertów cenowych</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-[#0c0d10] border rounded-xl p-4 flex items-center justify-between ${alert.isActive ? "border-white/5" : "border-white/5 opacity-50"}`}>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-[#f4f4f5]">{alert.symbol}</span>
                  <span className={`text-sm px-2 py-0.5 rounded ${alert.condition === "above" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
                    {alert.condition === "above" ? "▲" : "▼"} {alert.price.toLocaleString()}
                  </span>
                  {alert.triggered && <span className="text-xs bg-[#c9a962]/10 text-[#c9a962] px-2 py-0.5 rounded">Triggered</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(alert.id, alert.isActive)} className={`p-2 rounded-lg transition-colors ${alert.isActive ? "text-[#22c55e]" : "text-[#52525b]"}`}>
                    {alert.isActive ? "🔔" : "🔕"}
                  </button>
                  <button onClick={() => handleDelete(alert.id)} className="p-2 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg">🗑️</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

