"use client";

import { motion } from "framer-motion";

interface StockItem {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
}

interface StockTickerProps {
  items: StockItem[];
  speed?: number;
  pauseOnHover?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export default function StockTicker({
  items,
  speed = 40,
  pauseOnHover = true,
  variant = "default",
  className = "",
}: StockTickerProps) {
  const duplicatedItems = [...items, ...items];

  const TickerItem = ({ item }: { item: StockItem }) => {
    const isPositive = item.change >= 0;
    const colorClass = isPositive ? "text-[#4ade80]" : "text-[#f87171]";

    if (variant === "compact") {
      return (
        <div className="flex items-center gap-2 px-4">
          <span className="text-xs font-medium text-[#f4f4f5]">{item.symbol}</span>
          <span className="text-xs text-[#a1a1aa]">{item.price.toFixed(2)}</span>
          <span className={`text-xs font-medium ${colorClass}`}>
            {isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%
          </span>
        </div>
      );
    }

    if (variant === "detailed") {
      return (
        <div className="flex items-center gap-4 px-6 py-2 border-r border-white/5">
          <div>
            <span className="text-sm font-medium text-[#f4f4f5]">{item.symbol}</span>
            {item.name && <p className="text-[10px] text-[#52525b]">{item.name}</p>}
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-[#f4f4f5]">{item.price.toFixed(2)}</span>
            <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
              <span>{isPositive ? "▲" : "▼"}</span>
              <span>{isPositive ? "+" : ""}{item.change.toFixed(2)}</span>
              <span>({isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 px-5">
        <span className="text-sm font-medium text-[#f4f4f5]">{item.symbol}</span>
        <span className="text-sm text-[#a1a1aa]">{item.price.toFixed(2)}</span>
        <div className={`flex items-center gap-1 text-xs font-medium ${colorClass}`}>
          <span>{isPositive ? "▲" : "▼"}</span>
          <span>{isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`overflow-hidden bg-[#0c0d10] border-y border-white/5 ${className}`}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`flex whitespace-nowrap ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={{ width: "fit-content" }}
      >
        {duplicatedItems.map((item, index) => (
          <TickerItem key={`${item.symbol}-${index}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

// Vertical Stock Ticker
export function VerticalStockTicker({
  items,
  speed = 20,
  className = "",
}: {
  items: StockItem[];
  speed?: number;
  className?: string;
}) {
  const duplicatedItems = [...items, ...items];

  return (
    <div className={`overflow-hidden h-[200px] ${className}`}>
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedItems.map((item, index) => {
          const isPositive = item.change >= 0;
          return (
            <div
              key={`${item.symbol}-${index}`}
              className="flex items-center justify-between py-2 px-3 border-b border-white/5"
            >
              <div>
                <span className="text-sm font-medium text-[#f4f4f5]">{item.symbol}</span>
                {item.name && <p className="text-[10px] text-[#52525b]">{item.name}</p>}
              </div>
              <div className="text-right">
                <span className="text-sm text-[#f4f4f5]">{item.price.toFixed(2)}</span>
                <p className={`text-xs ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                  {isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// Single Stock Display
export function StockDisplay({
  symbol,
  name,
  price,
  change,
  changePercent,
  className = "",
}: StockItem & { className?: string }) {
  const isPositive = change >= 0;
  const colorClass = isPositive ? "text-[#4ade80]" : "text-[#f87171]";
  const bgClass = isPositive ? "bg-[#4ade80]/10" : "bg-[#f87171]/10";

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-lg font-bold text-[#f4f4f5]">{symbol}</h4>
          {name && <p className="text-xs text-[#71717a]">{name}</p>}
        </div>
        <div className={`px-2 py-1 rounded-lg ${bgClass}`}>
          <span className={`text-xs font-medium ${colorClass}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#f4f4f5]">{price.toFixed(2)}</span>
        <span className={`text-sm ${colorClass} mb-1`}>
          {isPositive ? "+" : ""}{change.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

