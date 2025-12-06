"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface CurrencyRate {
  symbol: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
}

// Mock data - w przyszłości można podłączyć API NBP lub inne źródło
const initialRates: CurrencyRate[] = [
  { symbol: "EUR/PLN", name: "Euro", rate: 4.3245, change: 0.0123, changePercent: 0.29 },
  { symbol: "USD/PLN", name: "Dolar", rate: 4.0156, change: -0.0087, changePercent: -0.22 },
  { symbol: "GBP/PLN", name: "Funt", rate: 5.1234, change: 0.0234, changePercent: 0.46 },
  { symbol: "CHF/PLN", name: "Frank", rate: 4.5678, change: 0.0045, changePercent: 0.10 },
  { symbol: "BTC/USD", name: "Bitcoin", rate: 97245.50, change: 1523.25, changePercent: 1.59 },
  { symbol: "ETH/USD", name: "Ethereum", rate: 3456.78, change: -45.23, changePercent: -1.29 },
  { symbol: "WIG20", name: "WIG20", rate: 2345.67, change: 23.45, changePercent: 1.01 },
  { symbol: "GOLD", name: "Złoto", rate: 2634.50, change: 12.30, changePercent: 0.47 },
];

export default function CurrencyTicker() {
  const [rates, setRates] = useState<CurrencyRate[]>(initialRates);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate live updates (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prevRates => 
        prevRates.map(rate => {
          const fluctuation = (Math.random() - 0.5) * 0.001;
          const newRate = rate.rate * (1 + fluctuation);
          const newChange = newRate - (rate.rate - rate.change);
          const newPercent = (newChange / (rate.rate - rate.change)) * 100;
          return {
            ...rate,
            rate: parseFloat(newRate.toFixed(rate.rate > 1000 ? 2 : 4)),
            change: parseFloat(newChange.toFixed(rate.rate > 1000 ? 2 : 4)),
            changePercent: parseFloat(newPercent.toFixed(2)),
          };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate rates for seamless loop
  const duplicatedRates = [...rates, ...rates];

  return (
    <div 
      className="relative w-full overflow-hidden bg-[#0a0b0e] border-b border-white/5 py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={containerRef}
    >
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: isPaused ? undefined : [0, "-50%"],
        }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{ willChange: "transform" }}
      >
        {duplicatedRates.map((rate, index) => (
          <div
            key={`${rate.symbol}-${index}`}
            className="flex items-center gap-3 px-4 py-1 rounded-full bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-default"
          >
            <span className="text-[11px] font-medium text-[#f4f4f5] tracking-wide">
              {rate.symbol}
            </span>
            <span className="text-[11px] font-mono text-[#d4d4d8]">
              {rate.rate.toLocaleString("pl-PL", { 
                minimumFractionDigits: rate.rate > 1000 ? 2 : 4,
                maximumFractionDigits: rate.rate > 1000 ? 2 : 4 
              })}
            </span>
            <span className={`text-[10px] font-medium flex items-center gap-0.5 ${
              rate.change >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              {rate.change >= 0 ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {rate.changePercent >= 0 ? "+" : ""}{rate.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0b0e] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0b0e] to-transparent pointer-events-none z-10" />
    </div>
  );
}

