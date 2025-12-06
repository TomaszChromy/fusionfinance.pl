"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ComparisonItem {
  id: string;
  name: string;
  logo?: string;
  features: Record<string, string | number | boolean | ReactNode>;
  highlighted?: boolean;
  badge?: string;
}

interface ComparisonTableProps {
  items: ComparisonItem[];
  features: Array<{ key: string; label: string; type?: "text" | "boolean" | "number" | "custom" }>;
  title?: string;
  className?: string;
}

export default function ComparisonTable({
  items,
  features,
  title,
  className = "",
}: ComparisonTableProps) {
  const renderValue = (value: string | number | boolean | ReactNode, type?: string) => {
    if (type === "boolean" || typeof value === "boolean") {
      return value ? (
        <svg className="w-5 h-5 text-[#4ade80] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-[#f87171] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    if (type === "number" && typeof value === "number") {
      return <span className="font-mono">{value.toLocaleString("pl-PL")}</span>;
    }
    return value;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      {title && (
        <h3 className="text-lg font-serif font-medium text-[#f4f4f5] mb-4">{title}</h3>
      )}
      
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-4 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider border-b border-white/10">
              Porównanie
            </th>
            {items.map((item) => (
              <th
                key={item.id}
                className={`p-4 text-center border-b ${
                  item.highlighted
                    ? "bg-[#c9a962]/10 border-[#c9a962]/30"
                    : "border-white/10"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="w-10 h-10 rounded-lg object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#c9a962]/20 flex items-center justify-center text-[#c9a962] font-bold">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#f4f4f5]">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-[#c9a962] text-[#08090c] text-[10px] font-medium rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <motion.tr
              key={feature.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-white/5 hover:bg-white/[0.02]"
            >
              <td className="p-4 text-sm text-[#a1a1aa]">{feature.label}</td>
              {items.map((item) => (
                <td
                  key={`${item.id}-${feature.key}`}
                  className={`p-4 text-center text-sm text-[#f4f4f5] ${
                    item.highlighted ? "bg-[#c9a962]/5" : ""
                  }`}
                >
                  {renderValue(item.features[feature.key], feature.type)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Broker Comparison preset
export function BrokerComparison({ className = "" }: { className?: string }) {
  const brokers: ComparisonItem[] = [
    {
      id: "xtb",
      name: "XTB",
      features: { spread: "Od 0.1 pips", commission: "0 PLN", minDeposit: 0, demo: true, mobile: true, mt4: true, crypto: true },
      highlighted: true,
      badge: "Polecany",
    },
    {
      id: "etoro",
      name: "eToro",
      features: { spread: "Od 1.0 pips", commission: "0 PLN", minDeposit: 200, demo: true, mobile: true, mt4: false, crypto: true },
    },
    {
      id: "plus500",
      name: "Plus500",
      features: { spread: "Od 0.8 pips", commission: "0 PLN", minDeposit: 100, demo: true, mobile: true, mt4: false, crypto: true },
    },
  ];

  const features = [
    { key: "spread", label: "Spread", type: "text" as const },
    { key: "commission", label: "Prowizja", type: "text" as const },
    { key: "minDeposit", label: "Min. depozyt (USD)", type: "number" as const },
    { key: "demo", label: "Konto demo", type: "boolean" as const },
    { key: "mobile", label: "Aplikacja mobilna", type: "boolean" as const },
    { key: "mt4", label: "MetaTrader 4", type: "boolean" as const },
    { key: "crypto", label: "Kryptowaluty", type: "boolean" as const },
  ];

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-2xl p-6 ${className}`}>
      <ComparisonTable items={brokers} features={features} title="Porównanie brokerów" />
    </div>
  );
}

