"use client";

import { motion } from "framer-motion";

interface Indicator {
  id: string;
  name: string;
  value: string;
  change?: number;
  previousValue?: string;
  date?: string;
  country?: string;
  countryFlag?: string;
}

const MOCK_INDICATORS: Indicator[] = [
  { id: "1", name: "PKB (r/r)", value: "3.2%", change: 0.4, previousValue: "2.8%", date: "Q3 2024", country: "Polska", countryFlag: "🇵🇱" },
  { id: "2", name: "Inflacja CPI", value: "4.7%", change: -0.3, previousValue: "5.0%", date: "Lis 2024", country: "Polska", countryFlag: "🇵🇱" },
  { id: "3", name: "Stopa referencyjna", value: "5.75%", change: 0, previousValue: "5.75%", date: "Gru 2024", country: "Polska", countryFlag: "🇵🇱" },
  { id: "4", name: "Bezrobocie", value: "5.1%", change: -0.2, previousValue: "5.3%", date: "Paź 2024", country: "Polska", countryFlag: "🇵🇱" },
  { id: "5", name: "Fed Funds Rate", value: "5.25%", change: -0.25, previousValue: "5.50%", date: "Gru 2024", country: "USA", countryFlag: "🇺🇸" },
  { id: "6", name: "ECB Rate", value: "4.00%", change: -0.25, previousValue: "4.25%", date: "Gru 2024", country: "EU", countryFlag: "🇪🇺" },
];

interface EconomicIndicatorsProps {
  indicators?: Indicator[];
  title?: string;
  variant?: "default" | "compact" | "grid";
  className?: string;
}

export default function EconomicIndicators({
  indicators = MOCK_INDICATORS,
  title = "Wskaźniki ekonomiczne",
  variant = "default",
  className = "",
}: EconomicIndicatorsProps) {
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {indicators.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="px-3 py-1.5 bg-[#0c0d10] border border-white/5 rounded-lg flex items-center gap-2"
          >
            <span className="text-sm">{item.countryFlag}</span>
            <span className="text-xs text-[#a1a1aa]">{item.name}</span>
            <span className="text-xs font-medium text-[#f4f4f5]">{item.value}</span>
            {item.change !== undefined && item.change !== 0 && (
              <span className={`text-[10px] ${item.change > 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                {item.change > 0 ? "↑" : "↓"}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <h3 className="text-sm font-medium text-[#f4f4f5] mb-4 flex items-center gap-2">
          <span>📊</span>
          {title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {indicators.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-white/[0.02] border border-white/5 rounded-lg"
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm">{item.countryFlag}</span>
                <span className="text-[10px] text-[#71717a]">{item.country}</span>
              </div>
              <p className="text-xs text-[#a1a1aa] mb-1">{item.name}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-[#f4f4f5]">{item.value}</span>
                {item.change !== undefined && item.change !== 0 && (
                  <span className={`text-xs ${item.change > 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}pp
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#52525b] mt-1">{item.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - list
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>📊</span>
          {title}
        </h3>
      </div>
      <div className="divide-y divide-white/5">
        {indicators.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.countryFlag}</span>
              <div>
                <p className="text-sm text-[#f4f4f5]">{item.name}</p>
                <p className="text-[10px] text-[#52525b]">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#f4f4f5]">{item.value}</p>
              {item.change !== undefined && (
                <p className={`text-[10px] ${
                  item.change > 0 ? "text-[#4ade80]" : item.change < 0 ? "text-[#f87171]" : "text-[#71717a]"
                }`}>
                  {item.change === 0 ? "bez zmian" : `${item.change > 0 ? "+" : ""}${item.change.toFixed(2)}pp`}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

