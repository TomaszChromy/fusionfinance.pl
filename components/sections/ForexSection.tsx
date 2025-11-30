"use client";

import { motion } from "framer-motion";

const forexData = [
  { pair: "EUR/PLN", rate: "4.3125", change: "-0.12%", isPositive: false },
  { pair: "USD/PLN", rate: "3.9780", change: "+0.08%", isPositive: true },
  { pair: "GBP/PLN", rate: "5.0234", change: "+0.15%", isPositive: true },
  { pair: "CHF/PLN", rate: "4.5678", change: "-0.05%", isPositive: false },
  { pair: "EUR/USD", rate: "1.0842", change: "+0.03%", isPositive: true },
];

export default function ForexSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]"
    >
      <div className="divide-y divide-white/5">
        {forexData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -5 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex items-center justify-between py-[13px] first:pt-0 last:pb-0 hover:bg-[#c9a962]/5 -mx-[8px] px-[8px] rounded transition-colors duration-300"
          >
            <span className="text-[13px] text-[#f4f4f5] font-medium">{item.pair}</span>
            <div className="flex items-center gap-[13px]">
              <span className="text-[13px] text-[#f4f4f5] font-mono">{item.rate}</span>
              <span
                className={`text-[11px] font-medium w-[55px] text-right ${
                  item.isPositive ? "text-[#4ade80]" : "text-[#f87171]"
                }`}
              >
                {item.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
