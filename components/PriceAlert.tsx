"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PriceAlertProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  showSparkline?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export default function PriceAlert({
  symbol,
  price,
  change,
  changePercent,
  currency = "PLN",
  variant = "default",
  className = "",
}: PriceAlertProps) {
  const isPositive = change >= 0;
  const colorClass = isPositive ? "text-[#4ade80]" : "text-[#f87171]";
  const bgClass = isPositive ? "bg-[#4ade80]/10" : "bg-[#f87171]/10";
  const borderClass = isPositive ? "border-[#4ade80]/30" : "border-[#f87171]/30";

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xs font-medium text-[#f4f4f5]">{symbol}</span>
        <span className="text-xs text-[#a1a1aa]">{price.toFixed(2)}</span>
        <span className={`text-xs font-medium ${colorClass}`}>
          {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
        </span>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${bgClass} ${borderClass} border rounded-xl p-4 ${className}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-lg font-semibold text-[#f4f4f5]">{symbol}</h4>
            <p className="text-xs text-[#71717a]">Aktualizacja: teraz</p>
          </div>
          <div className={`px-2 py-1 rounded-lg ${bgClass} ${colorClass} text-xs font-medium`}>
            {isPositive ? "↑" : "↓"} {Math.abs(changePercent).toFixed(2)}%
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-[#f4f4f5]">{price.toFixed(4)}</span>
            <span className="text-sm text-[#71717a] ml-1">{currency}</span>
          </div>
          <div className={`text-sm ${colorClass}`}>
            {isPositive ? "+" : ""}{change.toFixed(4)}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between p-3 bg-[#0c0d10] border border-white/5 rounded-lg hover:border-[#c9a962]/20 transition-colors ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center`}>
          <span className={`text-sm font-bold ${colorClass}`}>
            {isPositive ? "↑" : "↓"}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-[#f4f4f5]">{symbol}</span>
          <p className="text-xs text-[#71717a]">{currency}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-[#f4f4f5]">{price.toFixed(4)}</p>
        <p className={`text-xs font-medium ${colorClass}`}>
          {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
        </p>
      </div>
    </motion.div>
  );
}

// Price Ticker - horizontal scrolling
export function PriceTicker({
  items,
  speed = 30,
  className = "",
}: {
  items: Array<{ symbol: string; price: number; change: number }>;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 whitespace-nowrap"
      >
        {[...items, ...items].map((item, index) => {
          const isPositive = item.change >= 0;
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#f4f4f5]">{item.symbol}</span>
              <span className="text-xs text-[#a1a1aa]">{item.price.toFixed(2)}</span>
              <span className={`text-xs font-medium ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                {isPositive ? "+" : ""}{item.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// Price Alert Toast
export function PriceAlertToast({
  symbol,
  price,
  threshold,
  type,
  onClose,
}: {
  symbol: string;
  price: number;
  threshold: number;
  type: "above" | "below";
  onClose: () => void;
}) {
  const isAbove = type === "above";
  const colorClass = isAbove ? "text-[#4ade80]" : "text-[#f87171]";
  const bgClass = isAbove ? "bg-[#4ade80]/10" : "bg-[#f87171]/10";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`${bgClass} border border-white/10 rounded-xl p-4 max-w-sm`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center`}>
            <span className={`text-lg ${colorClass}`}>{isAbove ? "📈" : "📉"}</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-[#f4f4f5]">Alert cenowy: {symbol}</h4>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Cena {isAbove ? "powyżej" : "poniżej"} {threshold.toFixed(2)} → {price.toFixed(4)}
            </p>
          </div>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#f4f4f5]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

