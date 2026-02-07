"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  type: "stock" | "crypto" | "currency";
}

const MOCK_PORTFOLIO: PortfolioItem[] = [
  { symbol: "PKO", name: "PKO BP", quantity: 100, buyPrice: 42.5, currentPrice: 45.8, type: "stock" },
  { symbol: "BTC", name: "Bitcoin", quantity: 0.05, buyPrice: 35000, currentPrice: 42500, type: "crypto" },
  { symbol: "EUR", name: "Euro", quantity: 1000, buyPrice: 4.35, currentPrice: 4.28, type: "currency" },
  { symbol: "CDR", name: "CD Projekt", quantity: 50, buyPrice: 95.0, currentPrice: 112.0, type: "stock" },
];

interface PortfolioWidgetProps {
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export default function PortfolioWidget({ variant = "default", className = "" }: PortfolioWidgetProps) {
  const [portfolio] = useState<PortfolioItem[]>(() => MOCK_PORTFOLIO);

  const totalValue = portfolio.reduce((acc, item) => acc + item.quantity * item.currentPrice, 0);
  const totalCost = portfolio.reduce((acc, item) => acc + item.quantity * item.buyPrice, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = ((totalPL / totalCost) * 100) || 0;

  if (variant === "compact") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#f4f4f5]">💼 Portfel</span>
          <span className={`text-xs font-medium ${totalPL >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
            {totalPL >= 0 ? "+" : ""}{totalPLPercent.toFixed(2)}%
          </span>
        </div>
        <p className="text-xl font-bold text-[#f4f4f5]">
          {totalValue.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
        </p>
        <p className={`text-xs ${totalPL >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {totalPL >= 0 ? "+" : ""}{totalPL.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
            <span>💼</span>
            Mój portfel
          </h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            totalPL >= 0 ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-[#f87171]/10 text-[#f87171]"
          }`}>
            {totalPL >= 0 ? "↑" : "↓"} {Math.abs(totalPLPercent).toFixed(2)}%
          </span>
        </div>
        <p className="text-2xl font-bold text-[#f4f4f5] mt-2">
          {totalValue.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
        </p>
        <p className={`text-sm ${totalPL >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {totalPL >= 0 ? "+" : ""}{totalPL.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
        </p>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/5">
        {portfolio.map((item, index) => {
          const value = item.quantity * item.currentPrice;
          const pl = (item.currentPrice - item.buyPrice) * item.quantity;
          const plPercent = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100;

          return (
            <motion.div
              key={item.symbol}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-medium text-[#c9a962]">
                  {item.type === "crypto" ? "₿" : item.type === "currency" ? "💱" : "📈"}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#f4f4f5]">{item.symbol}</p>
                  <p className="text-xs text-[#52525b]">{item.quantity} × {item.currentPrice.toLocaleString("pl-PL")} PLN</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#f4f4f5]">
                  {value.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
                </p>
                <p className={`text-xs ${pl >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                  {pl >= 0 ? "+" : ""}{plPercent.toFixed(2)}%
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-white/5">
        <button className="w-full py-2 text-sm text-[#c9a962] hover:bg-white/5 rounded-lg transition-colors">
          + Dodaj pozycję
        </button>
      </div>
    </div>
  );
}
