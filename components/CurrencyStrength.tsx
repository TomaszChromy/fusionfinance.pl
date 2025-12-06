"use client";

import { motion } from "framer-motion";

interface CurrencyData {
  code: string;
  flag: string;
  strength: number; // -100 to 100
}

const MOCK_DATA: CurrencyData[] = [
  { code: "USD", flag: "🇺🇸", strength: 78 },
  { code: "EUR", flag: "🇪🇺", strength: 45 },
  { code: "GBP", flag: "🇬🇧", strength: 32 },
  { code: "JPY", flag: "🇯🇵", strength: -25 },
  { code: "CHF", flag: "🇨🇭", strength: 55 },
  { code: "AUD", flag: "🇦🇺", strength: -12 },
  { code: "CAD", flag: "🇨🇦", strength: 18 },
  { code: "PLN", flag: "🇵🇱", strength: -35 },
];

interface CurrencyStrengthProps {
  data?: CurrencyData[];
  title?: string;
  variant?: "default" | "compact" | "bars";
  className?: string;
}

function getStrengthColor(strength: number): string {
  if (strength >= 50) return "text-[#22c55e]";
  if (strength >= 20) return "text-[#4ade80]";
  if (strength >= -20) return "text-[#fbbf24]";
  if (strength >= -50) return "text-[#f87171]";
  return "text-[#ef4444]";
}

function getStrengthBg(strength: number): string {
  if (strength >= 50) return "bg-[#22c55e]";
  if (strength >= 20) return "bg-[#4ade80]";
  if (strength >= -20) return "bg-[#fbbf24]";
  if (strength >= -50) return "bg-[#f87171]";
  return "bg-[#ef4444]";
}

function getStrengthLabel(strength: number): string {
  if (strength >= 50) return "Bardzo silna";
  if (strength >= 20) return "Silna";
  if (strength >= -20) return "Neutralna";
  if (strength >= -50) return "Słaba";
  return "Bardzo słaba";
}

export default function CurrencyStrength({
  data = MOCK_DATA,
  title = "Siła walut",
  variant = "default",
  className = "",
}: CurrencyStrengthProps) {
  const sortedData = [...data].sort((a, b) => b.strength - a.strength);

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {sortedData.slice(0, 6).map((currency) => (
          <div
            key={currency.code}
            className="flex items-center gap-1.5 px-2 py-1 bg-[#0c0d10] border border-white/5 rounded-lg"
          >
            <span className="text-sm">{currency.flag}</span>
            <span className="text-xs font-medium text-[#f4f4f5]">{currency.code}</span>
            <span className={`text-xs font-medium ${getStrengthColor(currency.strength)}`}>
              {currency.strength > 0 ? "+" : ""}{currency.strength}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <h3 className="text-sm font-medium text-[#f4f4f5] mb-4 flex items-center gap-2">
          <span>💪</span>
          {title}
        </h3>
        <div className="space-y-3">
          {sortedData.map((currency, index) => {
            const absStrength = Math.abs(currency.strength);
            const isPositive = currency.strength >= 0;
            return (
              <motion.div
                key={currency.code}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currency.flag}</span>
                    <span className="text-xs font-medium text-[#f4f4f5]">{currency.code}</span>
                  </div>
                  <span className={`text-xs font-medium ${getStrengthColor(currency.strength)}`}>
                    {currency.strength > 0 ? "+" : ""}{currency.strength}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${absStrength / 2}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`absolute inset-y-0 ${getStrengthBg(currency.strength)} ${
                      isPositive ? "left-1/2" : "right-1/2"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant - table
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>💪</span>
          {title}
        </h3>
      </div>
      <div className="divide-y divide-white/5">
        {sortedData.map((currency, index) => (
          <motion.div
            key={currency.code}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{currency.flag}</span>
              <div>
                <p className="text-sm font-medium text-[#f4f4f5]">{currency.code}</p>
                <p className="text-[10px] text-[#52525b]">{getStrengthLabel(currency.strength)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currency.strength + 100) / 2}%` }}
                  className={getStrengthBg(currency.strength)}
                  style={{ height: "100%" }}
                />
              </div>
              <span className={`text-sm font-bold w-10 text-right ${getStrengthColor(currency.strength)}`}>
                {currency.strength > 0 ? "+" : ""}{currency.strength}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

