"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SparklineChart, { generateMockData } from "./SparklineChart";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  sparkline: number[];
}

// Symulowane dane GPW
const mockWIG20: StockData[] = [
  { symbol: "PKO", name: "PKO Bank Polski", price: 54.32, change: 1.23, changePercent: 2.32, volume: "2.4M", sparkline: generateMockData(20, "up") },
  { symbol: "PKN", name: "PKN Orlen", price: 68.45, change: -0.85, changePercent: -1.23, volume: "1.8M", sparkline: generateMockData(20, "down") },
  { symbol: "PZU", name: "PZU SA", price: 42.18, change: 0.56, changePercent: 1.35, volume: "1.2M", sparkline: generateMockData(20, "up") },
  { symbol: "PEO", name: "Bank Pekao", price: 156.80, change: 2.40, changePercent: 1.55, volume: "0.9M", sparkline: generateMockData(20, "up") },
  { symbol: "KGH", name: "KGHM", price: 142.35, change: -1.65, changePercent: -1.15, volume: "0.8M", sparkline: generateMockData(20, "down") },
  { symbol: "LPP", name: "LPP SA", price: 14250.00, change: 350.00, changePercent: 2.52, volume: "12K", sparkline: generateMockData(20, "up") },
  { symbol: "CDR", name: "CD Projekt", price: 118.90, change: 3.20, changePercent: 2.77, volume: "1.5M", sparkline: generateMockData(20, "up") },
  { symbol: "DNP", name: "Dino Polska", price: 432.50, change: -5.50, changePercent: -1.26, volume: "0.3M", sparkline: generateMockData(20, "down") },
  { symbol: "ALE", name: "Allegro", price: 32.45, change: 0.78, changePercent: 2.46, volume: "3.2M", sparkline: generateMockData(20, "up") },
  { symbol: "SPL", name: "Santander PL", price: 456.20, change: 8.30, changePercent: 1.85, volume: "0.2M", sparkline: generateMockData(20, "up") },
];

const mockIndices = [
  { symbol: "WIG20", name: "WIG20", price: 2345.67, change: 23.45, changePercent: 1.01, volume: "1.2B", sparkline: generateMockData(20, "up") },
  { symbol: "WIG", name: "WIG", price: 78234.12, change: 456.78, changePercent: 0.59, volume: "2.1B", sparkline: generateMockData(20, "up") },
  { symbol: "mWIG40", name: "mWIG40", price: 5678.90, change: -34.56, changePercent: -0.61, volume: "0.8B", sparkline: generateMockData(20, "down") },
  { symbol: "sWIG80", name: "sWIG80", price: 21345.67, change: 123.45, changePercent: 0.58, volume: "0.4B", sparkline: generateMockData(20, "up") },
];

type TabType = "indices" | "wig20";

export default function GPWStocksTable() {
  const [activeTab, setActiveTab] = useState<TabType>("indices");
  const [stocks, setStocks] = useState<StockData[]>(mockIndices);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      setStocks(activeTab === "indices" ? mockIndices : mockWIG20);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const fluctuation = (Math.random() - 0.5) * 0.5;
        const newPrice = stock.price * (1 + fluctuation / 100);
        const newChange = newPrice - (stock.price - stock.change);
        const newPercent = (newChange / (stock.price - stock.change)) * 100;
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(newPercent.toFixed(2)),
        };
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-[#0f1115] to-[#0c0d10]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#f4f4f5] flex items-center gap-2">
              <span className="text-xl">📈</span>
              Giełda Papierów Wartościowych
            </h2>
            <p className="text-xs text-[#71717a] mt-1">
              Notowania GPW w Warszawie · Sesja: {new Date().toLocaleDateString("pl-PL")}
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("indices")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "indices"
                  ? "bg-[#c9a962] text-[#08090c]"
                  : "text-[#a1a1aa] hover:text-[#f4f4f5]"
              }`}
            >
              Indeksy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("wig20")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "wig20"
                  ? "bg-[#c9a962] text-[#08090c]"
                  : "text-[#a1a1aa] hover:text-[#f4f4f5]"
              }`}
            >
              WIG20
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Symbol</th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Kurs</th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Zmiana</th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-[#71717a] uppercase tracking-wider hidden sm:table-cell">Obrót</th>
              <th className="px-5 py-3 text-center text-[10px] font-semibold text-[#71717a] uppercase tracking-wider hidden md:table-cell">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-3"><div className="h-5 bg-white/5 rounded w-20"></div></td>
                  <td className="px-5 py-3"><div className="h-5 bg-white/5 rounded w-16 ml-auto"></div></td>
                  <td className="px-5 py-3"><div className="h-5 bg-white/5 rounded w-14 ml-auto"></div></td>
                  <td className="px-5 py-3 hidden sm:table-cell"><div className="h-5 bg-white/5 rounded w-12 ml-auto"></div></td>
                  <td className="px-5 py-3 hidden md:table-cell"><div className="h-5 bg-white/5 rounded w-16 mx-auto"></div></td>
                </tr>
              ))
            ) : (
              stocks.map((stock, index) => {
                const isPositive = stock.changePercent >= 0;
                return (
                  <motion.tr
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <div>
                        <span className="text-sm font-semibold text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors">{stock.symbol}</span>
                        <span className="text-[10px] text-[#71717a] block truncate max-w-[120px]">{stock.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-mono font-medium text-[#f4f4f5] tabular-nums">
                        {stock.price.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-xs font-semibold ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                          {isPositive ? "+" : ""}{stock.change.toFixed(2)}
                        </span>
                        <span className={`text-[10px] ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                          {isPositive ? "▲" : "▼"} {Math.abs(stock.changePercent).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right hidden sm:table-cell">
                      <span className="text-xs text-[#a1a1aa] font-mono">{stock.volume}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex justify-center">
                        <SparklineChart data={stock.sparkline} width={70} height={22} showDot={false} strokeWidth={1.5} />
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
        <p className="text-[10px] text-[#71717a]">
          Dane opóźnione o 15 min · Źródło: GPW
        </p>
        <span className="flex items-center gap-1.5 text-[10px] text-[#22c55e]">
          <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse"></span>
          Sesja otwarta
        </span>
      </div>
    </motion.div>
  );
}

