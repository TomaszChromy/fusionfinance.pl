"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Trade {
  id: string;
  price: number;
  amount: number;
  side: "buy" | "sell";
  time: string;
}

const generateTrades = (): Trade[] => {
  const trades: Trade[] = [];
  for (let i = 0; i < 15; i++) {
    const price = 101500 + (Math.random() - 0.5) * 200;
    trades.push({
      id: `trade-${i}`,
      price: Math.round(price * 100) / 100,
      amount: Math.round(Math.random() * 1000) / 1000,
      side: Math.random() > 0.5 ? "buy" : "sell",
      time: new Date(Date.now() - i * 5000).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    });
  }
  return trades;
};

interface RecentTradesProps {
  trades?: Trade[];
  symbol?: string;
  maxTrades?: number;
  live?: boolean;
  className?: string;
}

export default function RecentTrades({
  trades: initialTrades,
  symbol = "BTC/USD",
  maxTrades = 12,
  live = true,
  className = "",
}: RecentTradesProps) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades || generateTrades());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulate live trades
  useEffect(() => {
    if (!live || !mounted) return;

    const interval = setInterval(() => {
      const price = 101500 + (Math.random() - 0.5) * 200;
      const newTrade: Trade = {
        id: `trade-${Date.now()}`,
        price: Math.round(price * 100) / 100,
        amount: Math.round(Math.random() * 1000) / 1000,
        side: Math.random() > 0.5 ? "buy" : "sell",
        time: new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };
      setTrades((prev) => [newTrade, ...prev.slice(0, maxTrades - 1)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [live, maxTrades, mounted]);

  if (!mounted) return null;

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>🔄</span>
          Ostatnie transakcje
          {live && (
            <span className="flex items-center gap-1 text-[10px] text-[#4ade80]">
              <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse" />
              Live
            </span>
          )}
        </h3>
        <span className="text-xs text-[#71717a]">{symbol}</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-4 px-4 py-2 border-b border-white/5 text-[10px] text-[#52525b] uppercase tracking-wider">
        <span>Cena</span>
        <span className="text-center">Ilość</span>
        <span className="text-center">Wartość</span>
        <span className="text-right">Czas</span>
      </div>

      {/* Trades list */}
      <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence mode="popLayout">
          {trades.slice(0, maxTrades).map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, x: -20, backgroundColor: trade.side === "buy" ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)" }}
              animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-4 px-4 py-2 text-xs border-b border-white/[0.02] hover:bg-white/[0.02]"
            >
              <span className={trade.side === "buy" ? "text-[#4ade80]" : "text-[#f87171]"}>
                {trade.price.toLocaleString("pl-PL", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-center text-[#a1a1aa]">{trade.amount.toFixed(4)}</span>
              <span className="text-center text-[#71717a]">
                {(trade.price * trade.amount).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-right text-[#52525b]">{trade.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="p-3 border-t border-white/5 flex items-center justify-between text-[10px]">
        <span className="text-[#4ade80]">
          ● Kupno: {trades.filter((t) => t.side === "buy").length}
        </span>
        <span className="text-[#f87171]">
          ● Sprzedaż: {trades.filter((t) => t.side === "sell").length}
        </span>
      </div>
    </div>
  );
}

