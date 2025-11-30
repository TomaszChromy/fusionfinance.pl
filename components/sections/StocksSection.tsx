"use client";

import { motion } from "framer-motion";

const stockData = [
  { name: "WIG20", value: "2,456.78", change: "+1.24%", isPositive: true, volume: "1.2B PLN" },
  { name: "WIG", value: "78,234.56", change: "+0.87%", isPositive: true, volume: "2.1B PLN" },
  { name: "mWIG40", value: "5,678.90", change: "-0.34%", isPositive: false, volume: "456M PLN" },
  { name: "sWIG80", value: "21,345.67", change: "+0.56%", isPositive: true, volume: "234M PLN" },
  { name: "DAX", value: "16,789.45", change: "+0.67%", isPositive: true, volume: "4.5B EUR" },
  { name: "S&P 500", value: "4,783.45", change: "+1.23%", isPositive: true, volume: "12.3B USD" },
];

export default function StocksSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 21 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="bg-[#0f1115] border border-[#c9a962]/10 rounded-lg p-[21px]"
    >
      <div className="flex items-center justify-between mb-[21px]">
        <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em] flex items-center gap-[8px]">
          <svg className="w-[18px] h-[18px] text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Indeksy giełdowe
        </h2>
        <span className="text-[10px] text-[#71717a] flex items-center gap-[5px] uppercase tracking-[0.1em]">
          <span className="w-[6px] h-[6px] bg-[#4ade80] rounded-full animate-pulse" />
          Live
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[10px] text-[#71717a] border-b border-white/5 uppercase tracking-[0.1em]">
              <th className="text-left py-[13px] font-medium">Indeks</th>
              <th className="text-right py-[13px] font-medium">Wartość</th>
              <th className="text-right py-[13px] font-medium">Zmiana</th>
              <th className="text-right py-[13px] font-medium hidden md:table-cell">Wolumen</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-white/5 last:border-b-0 hover:bg-[#c9a962]/5 transition-colors duration-300 cursor-pointer"
              >
                <td className="py-[13px]">
                  <span className="font-medium text-[#f4f4f5]">{stock.name}</span>
                </td>
                <td className="py-[13px] text-right text-[#f4f4f5] font-mono">{stock.value}</td>
                <td className="py-[13px] text-right">
                  <span
                    className={`inline-flex items-center gap-[3px] px-[8px] py-[3px] rounded text-[11px] font-medium ${
                      stock.isPositive
                        ? "bg-[#4ade80]/10 text-[#4ade80]"
                        : "bg-[#f87171]/10 text-[#f87171]"
                    }`}
                  >
                    {stock.isPositive ? "↑" : "↓"} {stock.change}
                  </span>
                </td>
                <td className="py-[13px] text-right text-[#71717a] hidden md:table-cell">{stock.volume}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
