"use client";

import { motion } from "framer-motion";

interface InvestmentIdea {
  id: string;
  title: string;
  asset: string;
  type: "buy" | "sell" | "hold";
  target?: number;
  current: number;
  potential: number;
  risk: "low" | "medium" | "high";
  timeframe: string;
  reasoning: string;
}

const MOCK_IDEAS: InvestmentIdea[] = [
  { id: "1", title: "Wzrost PKO BP", asset: "PKO", type: "buy", target: 55, current: 48.56, potential: 13.3, risk: "low", timeframe: "6-12 miesięcy", reasoning: "Silne wyniki finansowe i dywidendy" },
  { id: "2", title: "Korekta na BTC", asset: "BTC/USD", type: "hold", current: 101500, potential: 0, risk: "high", timeframe: "1-3 miesiące", reasoning: "Oczekiwanie na ustabilizowanie po ATH" },
  { id: "3", title: "Wzrost KGHM", asset: "KGHM", type: "buy", target: 180, current: 152.30, potential: 18.2, risk: "medium", timeframe: "3-6 miesięcy", reasoning: "Wzrost cen miedzi na rynkach" },
  { id: "4", title: "Sprzedaż EUR/PLN", asset: "EUR/PLN", type: "sell", target: 4.20, current: 4.28, potential: 1.9, risk: "low", timeframe: "1-3 miesiące", reasoning: "Silny złoty i stabilna gospodarka" },
];

const typeConfig = {
  buy: { icon: "📈", label: "KUP", color: "text-[#4ade80]", bg: "bg-[#4ade80]/10", border: "border-[#4ade80]" },
  sell: { icon: "📉", label: "SPRZEDAJ", color: "text-[#f87171]", bg: "bg-[#f87171]/10", border: "border-[#f87171]" },
  hold: { icon: "⏸️", label: "TRZYMAJ", color: "text-[#fbbf24]", bg: "bg-[#fbbf24]/10", border: "border-[#fbbf24]" },
};

const riskConfig = {
  low: { label: "Niskie", color: "text-[#4ade80]" },
  medium: { label: "Średnie", color: "text-[#fbbf24]" },
  high: { label: "Wysokie", color: "text-[#f87171]" },
};

interface InvestmentIdeasProps {
  ideas?: InvestmentIdea[];
  variant?: "default" | "compact" | "cards";
  maxItems?: number;
  className?: string;
}

export default function InvestmentIdeas({
  ideas = MOCK_IDEAS,
  variant = "default",
  maxItems = 4,
  className = "",
}: InvestmentIdeasProps) {
  if (variant === "compact") {
    return (
      <div className={`space-y-2 ${className}`}>
        {ideas.slice(0, maxItems).map((idea) => {
          const type = typeConfig[idea.type];
          return (
            <div key={idea.id} className="flex items-center gap-3 p-2 bg-[#0c0d10] border border-white/5 rounded-lg">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${type.bg} ${type.color}`}>{type.label}</span>
              <span className="text-xs font-medium text-[#f4f4f5]">{idea.asset}</span>
              {idea.potential > 0 && (
                <span className="text-xs text-[#4ade80] ml-auto">+{idea.potential.toFixed(1)}%</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        {ideas.slice(0, maxItems).map((idea, index) => {
          const type = typeConfig[idea.type];
          const risk = riskConfig[idea.risk];
          return (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-[#0c0d10] border-l-2 ${type.border} border border-white/5 rounded-xl p-4`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-bold rounded ${type.bg} ${type.color}`}>{type.label}</span>
                <span className={`text-[10px] ${risk.color}`}>Ryzyko: {risk.label}</span>
              </div>
              <h4 className="text-sm font-medium text-[#f4f4f5] mb-1">{idea.title}</h4>
              <p className="text-xs text-[#71717a] mb-3">{idea.reasoning}</p>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#52525b]">{idea.timeframe}</span>
                {idea.potential > 0 && <span className="text-[#4ade80] font-medium">Potencjał: +{idea.potential}%</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Default variant - list
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>💡</span>
          Pomysły inwestycyjne
        </h3>
      </div>

      <div className="divide-y divide-white/5">
        {ideas.slice(0, maxItems).map((idea, index) => {
          const type = typeConfig[idea.type];
          const risk = riskConfig[idea.risk];
          return (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className={`text-2xl ${type.bg} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                  {type.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${type.bg} ${type.color}`}>{type.label}</span>
                    <span className="text-xs font-medium text-[#c9a962]">{idea.asset}</span>
                  </div>
                  <h4 className="text-sm font-medium text-[#f4f4f5]">{idea.title}</h4>
                  <p className="text-xs text-[#71717a] mt-1 line-clamp-1">{idea.reasoning}</p>
                  <div className="flex items-center gap-4 mt-2 text-[10px]">
                    <span className="text-[#52525b]">⏱ {idea.timeframe}</span>
                    <span className={risk.color}>⚠ {risk.label}</span>
                    {idea.potential > 0 && <span className="text-[#4ade80]">📊 +{idea.potential}%</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

