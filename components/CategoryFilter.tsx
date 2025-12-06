"use client";

import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const categories: Category[] = [
  { id: "all", name: "Wszystkie", icon: "📰", color: "#c9a962" },
  { id: "rynki", name: "Rynki", icon: "📊", color: "#c9a962" },
  { id: "gielda", name: "Giełda", icon: "📈", color: "#22c55e" },
  { id: "crypto", name: "Crypto", icon: "₿", color: "#f59e0b" },
  { id: "waluty", name: "Waluty", icon: "💱", color: "#3b82f6" },
  { id: "analizy", name: "Analizy", icon: "🔍", color: "#a855f7" },
];

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
  variant?: "pills" | "dropdown";
}

export default function CategoryFilter({ 
  selected, 
  onChange, 
  variant = "pills" 
}: CategoryFilterProps) {
  if (variant === "dropdown") {
    return (
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full px-4 py-3 bg-[#0c0d10] border border-white/10 rounded-xl text-[#f4f4f5] focus:outline-none focus:border-[#c9a962]/50 cursor-pointer pr-10"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <motion.button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isSelected
                ? "text-[#08090c]"
                : "text-[#a1a1aa] hover:text-[#f4f4f5] bg-[#0c0d10] border border-white/10 hover:border-white/20"
            }`}
            style={isSelected ? { backgroundColor: cat.color } : {}}
          >
            <span className="flex items-center gap-2">
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export { categories };
export type { Category };

