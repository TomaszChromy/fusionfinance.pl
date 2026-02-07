"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveIndicator from "@/components/LiveIndicator";

type Channel = "email" | "push";
type Condition = "above" | "below" | "percent";
type AssetClass = "stock" | "crypto" | "fx" | "macro";

interface Alert {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  condition: Condition;
  threshold: number;
  isActive: boolean;
  triggered: boolean;
  channel: Channel;
  note?: string;
  createdAt: string;
}

const STORAGE_KEY = "ff_alerts_v1";

const templates: Array<Partial<Alert> & { label: string }> = [
  { label: "BTC > ATH", symbol: "BTC", assetClass: "crypto", condition: "above", threshold: 100000, channel: "push" },
  { label: "EUR/PLN -1% dziennie", symbol: "EUR/PLN", assetClass: "fx", condition: "percent", threshold: -1, channel: "email" },
  { label: "WIG20 +2% dziennie", symbol: "WIG20", assetClass: "stock", condition: "percent", threshold: 2, channel: "push" },
  { label: "Inflacja CPI < 4%", symbol: "CPI", assetClass: "macro", condition: "below", threshold: 4, channel: "email" },
];

function loadFromStorage(): Alert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Alert[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(alerts: Alert[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(() => loadFromStorage());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Alert>>({
    symbol: "",
    assetClass: "stock",
    condition: "above",
    threshold: undefined,
    channel: "push",
    note: "",
  });

  // spróbuj zsynchronizować z backendem (API), fallback do localStorage
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch("/api/alerts");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAlerts(data);
          saveToStorage(data);
          return;
        }
      } catch {
        const stored = loadFromStorage();
        setAlerts(stored);
      }
    };
    sync();
  }, []);

  useEffect(() => {
    saveToStorage(alerts);
  }, [alerts]);

  const addAlert = async (data: Partial<Alert>) => {
    if (!data.symbol || data.threshold === undefined) return;
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: data.symbol,
          assetClass: data.assetClass,
          condition: data.condition,
          threshold: data.threshold,
          channel: data.channel,
          note: data.note,
        }),
      });
      if (!res.ok) throw new Error("create failed");
      const alert = await res.json();
      setAlerts(prev => [alert, ...prev]);
    } catch {
      const alert: Alert = {
        id: crypto.randomUUID(),
        symbol: data.symbol.toUpperCase(),
        assetClass: (data.assetClass || "stock") as AssetClass,
        condition: (data.condition || "above") as Condition,
        threshold: Number(data.threshold),
        channel: (data.channel || "push") as Channel,
        isActive: true,
        triggered: false,
        note: data.note || "",
        createdAt: new Date().toISOString(),
      };
      setAlerts(prev => [alert, ...prev]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert(formData);
    setFormData({ symbol: "", assetClass: "stock", condition: "above", threshold: undefined, channel: "push", note: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
    } catch {/* ignore */}
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const toggleActive = async (id: string) => {
    const next = alerts.find(a => a.id === id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    if (next) {
      try {
        await fetch("/api/alerts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, isActive: !next.isActive }),
        });
      } catch { /* ignore */ }
    }
  };

  const activeCount = useMemo(() => alerts.filter(a => a.isActive).length, [alerts]);

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-5 py-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#71717a]">Alerty</p>
            <h1 className="text-3xl font-serif font-medium text-[#f4f4f5] flex items-center gap-2">
              🔔 Centrum powiadomień <LiveIndicator label="Na żywo" />
            </h1>
            <p className="text-sm text-[#71717a] mt-1">Warunki cenowe, % zmiany, makro. Inspirowane app-kami giełdowymi.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a1a1aa] bg-white/5 px-3 py-1 rounded-full">Aktywne: {activeCount}</span>
            <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-gradient-to-r from-[#c9a962] to-[#b8943d] text-[#08090c] font-medium rounded-lg text-sm">
              + Nowy alert
            </button>
          </div>
        </div>

        {/* Szablony */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          {templates.map((tpl) => (
            <button
              key={tpl.label}
              onClick={() => addAlert({ ...tpl, threshold: tpl.threshold })}
              className="group bg-[#0c0d10] border border-white/5 rounded-xl p-4 text-left hover:border-[#c9a962]/40 transition-colors"
            >
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#c9a962] mb-1">{tpl.assetClass?.toUpperCase()}</p>
              <p className="text-sm font-semibold text-[#f4f4f5] group-hover:text-[#c9a962]">{tpl.label}</p>
              {tpl.threshold !== undefined && (
                <p className="text-xs text-[#71717a] mt-1">Próg: {tpl.threshold}{tpl.condition === "percent" ? "%" : ""}</p>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="bg-[#0c0d10] border border-white/5 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input type="text" placeholder="Ticker (BTC, EUR/PLN, WIG20, CPI)" value={formData.symbol} onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]" required />
                <select value={formData.assetClass} onChange={e => setFormData({ ...formData, assetClass: e.target.value as AssetClass })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5]">
                  <option value="stock">Akcja/indeks</option>
                  <option value="crypto">Krypto</option>
                  <option value="fx">FX</option>
                  <option value="macro">Makro</option>
                </select>
                <select value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value as Condition })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5]">
                  <option value="above">Powyżej</option>
                  <option value="below">Poniżej</option>
                  <option value="percent">% zmiany (d/d)</option>
                </select>
                <input type="number" step="any" placeholder="Próg (np. 4.30)" value={formData.threshold ?? ""} onChange={e => setFormData({ ...formData, threshold: e.target.value ? Number(e.target.value) : undefined })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b]" required />
                <select value={formData.channel} onChange={e => setFormData({ ...formData, channel: e.target.value as Channel })} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5]">
                  <option value="push">Powiadomienie push</option>
                  <option value="email">E-mail</option>
                </select>
              </div>
              <textarea
                placeholder="Notatka (opcjonalnie)"
                value={formData.note || ""}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                className="mt-3 w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#f4f4f5] placeholder-[#52525b]"
              />
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
              <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-[#0c0d10] border rounded-xl p-4 flex items-center justify-between ${alert.isActive ? "border-white/5" : "border-white/5 opacity-60"}`}>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-lg font-medium text-[#f4f4f5]">{alert.symbol}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-[#c9a962] uppercase tracking-[0.08em]">
                    {alert.assetClass}
                  </span>
                  <span className={`text-sm px-2 py-0.5 rounded ${alert.condition === "above" ? "bg-[#22c55e]/10 text-[#22c55e]" : alert.condition === "below" ? "bg-[#ef4444]/10 text-[#ef4444]" : "bg-[#38bdf8]/10 text-[#38bdf8]"}`}>
                    {alert.condition === "percent" ? "% zmiana" : alert.condition === "above" ? "▲" : "▼"} {alert.threshold}{alert.condition === "percent" ? "%" : ""}
                  </span>
                  <span className="text-[11px] text-[#71717a] px-2 py-0.5 rounded bg-white/5">
                    Kanał: {alert.channel === "push" ? "Push" : "E-mail"}
                  </span>
                  {alert.note && <span className="text-xs text-[#a1a1aa]">• {alert.note}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(alert.id)} className={`p-2 rounded-lg transition-colors ${alert.isActive ? "text-[#22c55e]" : "text-[#52525b]"}`}>
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
