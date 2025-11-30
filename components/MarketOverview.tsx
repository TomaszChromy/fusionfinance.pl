"use client";

import { motion } from "framer-motion";

const marketData = [
  { name: "WIG20", value: "2,456.78", change: "+1.24%", isPositive: true },
  { name: "DAX", value: "16,789.45", change: "+0.67%", isPositive: true },
  { name: "S&P 500", value: "4,783.45", change: "+1.23%", isPositive: true },
  { name: "NASDAQ", value: "15,234.67", change: "+0.87%", isPositive: true },
  { name: "EUR/PLN", value: "4.3125", change: "-0.12%", isPositive: false },
  { name: "USD/PLN", value: "3.9780", change: "+0.08%", isPositive: true },
  { name: "Gold", value: "2,045.60", change: "+0.45%", isPositive: true },
  { name: "BTC", value: "97,245", change: "+2.34%", isPositive: true },
];

export default function MarketOverview() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="py-[13px] border-b border-[#c9a962]/10 mb-[34px]"
    >
      <div className="flex items-center gap-[34px] overflow-x-auto scrollbar-hide">
        {marketData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex items-center gap-[8px] whitespace-nowrap group"
          >
            <span className="text-[11px] text-[#71717a] uppercase tracking-[0.05em] group-hover:text-[#a1a1aa] transition-colors duration-300">{item.name}</span>
            <span className="text-[12px] text-[#f4f4f5] font-mono">{item.value}</span>
            <span
              className={`text-[11px] font-medium ${
                item.isPositive ? "text-[#4ade80]" : "text-[#f87171]"
              }`}
            >
              {item.change}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

