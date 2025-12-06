"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface Order {
  price: number;
  amount: number;
  total?: number;
}

interface OrderBookProps {
  bids?: Order[];
  asks?: Order[];
  lastPrice?: number;
  spread?: number;
  symbol?: string;
  className?: string;
}

const MOCK_BIDS: Order[] = [
  { price: 101450, amount: 0.245 },
  { price: 101400, amount: 0.512 },
  { price: 101350, amount: 0.128 },
  { price: 101300, amount: 0.892 },
  { price: 101250, amount: 0.356 },
];

const MOCK_ASKS: Order[] = [
  { price: 101500, amount: 0.189 },
  { price: 101550, amount: 0.423 },
  { price: 101600, amount: 0.671 },
  { price: 101650, amount: 0.234 },
  { price: 101700, amount: 0.567 },
];

export default function OrderBook({
  bids = MOCK_BIDS,
  asks = MOCK_ASKS,
  lastPrice = 101475,
  spread,
  symbol = "BTC/USD",
  className = "",
}: OrderBookProps) {
  const { maxBidTotal, maxAskTotal, calculatedSpread } = useMemo(() => {
    let bidSum = 0;
    const bidsWithTotal = bids.map((b) => {
      bidSum += b.amount;
      return { ...b, total: bidSum };
    });

    let askSum = 0;
    const asksWithTotal = asks.map((a) => {
      askSum += a.amount;
      return { ...a, total: askSum };
    });

    const maxBid = Math.max(...bidsWithTotal.map((b) => b.total!));
    const maxAsk = Math.max(...asksWithTotal.map((a) => a.total!));
    const calcSpread = spread ?? (asks[0]?.price - bids[0]?.price);

    return { maxBidTotal: maxBid, maxAskTotal: maxAsk, calculatedSpread: calcSpread };
  }, [bids, asks, spread]);

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>📚</span>
          Książka zleceń
        </h3>
        <span className="text-xs text-[#71717a]">{symbol}</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-4 py-2 border-b border-white/5 text-[10px] text-[#52525b] uppercase tracking-wider">
        <span>Cena</span>
        <span className="text-center">Ilość</span>
        <span className="text-right">Suma</span>
      </div>

      {/* Asks (reversed so lowest price is at bottom) */}
      <div className="divide-y divide-white/[0.02]">
        {[...asks].reverse().map((ask, index) => {
          let cumTotal = 0;
          for (let i = 0; i <= asks.length - 1 - index; i++) {
            cumTotal += asks[i].amount;
          }
          const fillPercent = (cumTotal / maxAskTotal) * 100;

          return (
            <motion.div
              key={`ask-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative grid grid-cols-3 px-4 py-1.5 text-xs hover:bg-white/[0.02]"
            >
              <div
                className="absolute inset-y-0 right-0 bg-[#f87171]/10"
                style={{ width: `${fillPercent}%` }}
              />
              <span className="relative text-[#f87171]">{ask.price.toLocaleString()}</span>
              <span className="relative text-center text-[#a1a1aa]">{ask.amount.toFixed(3)}</span>
              <span className="relative text-right text-[#71717a]">{cumTotal.toFixed(3)}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Spread / Last price */}
      <div className="px-4 py-3 bg-white/[0.02] border-y border-white/5 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-[#f4f4f5]">{lastPrice.toLocaleString()}</span>
          <span className="text-xs text-[#71717a] ml-2">USD</span>
        </div>
        <span className="text-[10px] text-[#52525b]">
          Spread: {calculatedSpread.toLocaleString()} ({((calculatedSpread / lastPrice) * 100).toFixed(3)}%)
        </span>
      </div>

      {/* Bids */}
      <div className="divide-y divide-white/[0.02]">
        {bids.map((bid, index) => {
          let cumTotal = 0;
          for (let i = 0; i <= index; i++) {
            cumTotal += bids[i].amount;
          }
          const fillPercent = (cumTotal / maxBidTotal) * 100;

          return (
            <motion.div
              key={`bid-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative grid grid-cols-3 px-4 py-1.5 text-xs hover:bg-white/[0.02]"
            >
              <div
                className="absolute inset-y-0 right-0 bg-[#4ade80]/10"
                style={{ width: `${fillPercent}%` }}
              />
              <span className="relative text-[#4ade80]">{bid.price.toLocaleString()}</span>
              <span className="relative text-center text-[#a1a1aa]">{bid.amount.toFixed(3)}</span>
              <span className="relative text-right text-[#71717a]">{cumTotal.toFixed(3)}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

