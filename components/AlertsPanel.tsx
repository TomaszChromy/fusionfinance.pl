"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface PriceAlertItem {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  currentPrice: number;
  condition: "above" | "below";
  active: boolean;
  createdAt: string;
}

const MOCK_ALERTS: PriceAlertItem[] = [
  { id: "1", symbol: "EUR/PLN", name: "Euro", targetPrice: 4.40, currentPrice: 4.28, condition: "above", active: true, createdAt: new Date().toISOString() },
  { id: "2", symbol: "BTC/USD", name: "Bitcoin", targetPrice: 40000, currentPrice: 42500, condition: "below", active: true, createdAt: new Date().toISOString() },
  { id: "3", symbol: "USD/PLN", name: "Dolar", targetPrice: 3.90, currentPrice: 3.95, condition: "below", active: false, createdAt: new Date().toISOString() },
];

interface AlertsPanelProps {
  variant?: "default" | "compact" | "sidebar";
  className?: string;
}

export default function AlertsPanel({ variant = "default", className = "" }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<PriceAlertItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setAlerts(MOCK_ALERTS);
  }, []);

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const activeCount = alerts.filter((a) => a.active).length;

  if (variant === "compact") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#f4f4f5]">🔔 Alerty</span>
          <span className="px-2 py-0.5 bg-[#c9a962]/10 text-[#c9a962] text-xs rounded-full">
            {activeCount} aktywnych
          </span>
        </div>
        <p className="text-xs text-[#52525b] mt-2">
          {alerts.length > 0 ? `Śledzisz ${alerts.length} alertów` : "Brak alertów"}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>🔔</span>
          Alerty cenowe
          <span className="px-2 py-0.5 bg-[#c9a962]/10 text-[#c9a962] text-[10px] rounded-full">
            {activeCount}
          </span>
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs text-[#c9a962] hover:text-[#d4b872] transition-colors"
        >
          + Nowy alert
        </button>
      </div>

      {/* New Alert Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Symbol (np. EUR/PLN)"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-[#f4f4f5] placeholder-[#52525b]"
                />
                <input
                  type="number"
                  placeholder="Cena docelowa"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-[#f4f4f5] placeholder-[#52525b]"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 bg-[#c9a962] text-[#08090c] text-xs font-medium rounded-lg">
                  Dodaj alert
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-white/5 text-[#71717a] text-xs rounded-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#52525b]">Brak alertów</p>
            <p className="text-xs text-[#3f3f46] mt-1">Dodaj pierwszy alert cenowy</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              className={`p-3 flex items-center gap-3 ${!alert.active && "opacity-50"}`}
            >
              <button
                onClick={() => toggleAlert(alert.id)}
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  alert.active ? "bg-[#c9a962]" : "bg-white/10"
                }`}
              >
                <motion.div
                  animate={{ x: alert.active ? 20 : 0 }}
                  className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"
                />
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#f4f4f5]">{alert.symbol}</p>
                <p className="text-xs text-[#52525b]">
                  {alert.condition === "above" ? "Powyżej" : "Poniżej"} {alert.targetPrice.toLocaleString("pl-PL")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-[#a1a1aa]">{alert.currentPrice.toLocaleString("pl-PL")}</p>
                <span className={`text-[10px] ${
                  (alert.condition === "above" && alert.currentPrice >= alert.targetPrice) ||
                  (alert.condition === "below" && alert.currentPrice <= alert.targetPrice)
                    ? "text-[#4ade80]"
                    : "text-[#52525b]"
                }`}>
                  {alert.condition === "above" ? "↑" : "↓"}
                </span>
              </div>

              <button
                onClick={() => deleteAlert(alert.id)}
                className="p-1.5 text-[#52525b] hover:text-[#f87171] transition-colors"
              >
                ✕
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

