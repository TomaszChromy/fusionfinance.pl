"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: "stock" | "crypto" | "currency" | "index";
}

const MOCK_WATCHLIST: WatchlistItem[] = [
  { id: "1", symbol: "WIG20", name: "WIG20", price: 2345.67, change: 12.5, changePercent: 0.54, type: "index" },
  { id: "2", symbol: "EUR/PLN", name: "Euro", price: 4.2845, change: -0.0123, changePercent: -0.29, type: "currency" },
  { id: "3", symbol: "BTC", name: "Bitcoin", price: 42567.89, change: 1234.5, changePercent: 2.98, type: "crypto" },
  { id: "4", symbol: "PKO", name: "PKO BP", price: 45.82, change: 0.67, changePercent: 1.48, type: "stock" },
  { id: "5", symbol: "USD/PLN", name: "Dolar", price: 3.9534, change: 0.0087, changePercent: 0.22, type: "currency" },
];

const TYPE_ICONS: Record<string, string> = {
  stock: "📈",
  crypto: "₿",
  currency: "💱",
  index: "📊",
};

interface WatchlistProps {
  variant?: "default" | "compact" | "mini";
  className?: string;
}

export default function Watchlist({ variant = "default", className = "" }: WatchlistProps) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage or use mock data
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems(MOCK_WATCHLIST);
      }
    } else {
      setItems(MOCK_WATCHLIST);
    }
    setIsLoaded(true);
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  if (variant === "mini") {
    return (
      <div className={`flex items-center gap-4 overflow-x-auto pb-2 ${className}`}>
        {items.slice(0, 5).map((item) => (
          <div key={item.id} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs font-medium text-[#f4f4f5]">{item.symbol}</span>
            <span className={`text-xs ${item.change >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
              {item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#f4f4f5]">👁️ Obserwowane</span>
          <span className="text-xs text-[#52525b]">{items.length} pozycji</span>
        </div>
        <div className="space-y-2">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-xs text-[#a1a1aa]">{item.symbol}</span>
              <span className={`text-xs font-medium ${item.change >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                {item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>👁️</span>
          Obserwowane
          <span className="px-2 py-0.5 bg-white/5 text-[#71717a] text-[10px] rounded-full">
            {items.length}
          </span>
        </h3>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="p-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors group"
            >
              <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">
                {TYPE_ICONS[item.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#f4f4f5]">{item.symbol}</p>
                <p className="text-xs text-[#52525b]">{item.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#f4f4f5]">
                  {item.price.toLocaleString("pl-PL", { maximumFractionDigits: 4 })}
                </p>
                <p className={`text-xs ${item.change >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                  {item.change >= 0 ? "↑" : "↓"} {Math.abs(item.changePercent).toFixed(2)}%
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-[#52525b] hover:text-[#f87171] opacity-0 group-hover:opacity-100 transition-all"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-white/5">
        <button className="w-full py-2 text-sm text-[#c9a962] hover:bg-white/5 rounded-lg transition-colors">
          + Dodaj do obserwowanych
        </button>
      </div>
    </div>
  );
}

