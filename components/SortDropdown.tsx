"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface SortOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export default function SortDropdown({
  options,
  value,
  onChange,
  label = "Sortuj",
  variant = "default",
  className = "",
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (variant === "minimal") {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {selectedOption.label}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full right-0 mt-1 bg-[#0c0d10] border border-white/10 rounded-lg overflow-hidden z-50 min-w-[140px] shadow-xl"
            >
              {options.map(option => (
                <button
                  key={option.id}
                  onClick={() => { onChange(option.id); setIsOpen(false); }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors ${
                    option.id === value
                      ? "bg-[#c9a962]/10 text-[#c9a962]"
                      : "text-[#a1a1aa] hover:bg-white/5 hover:text-[#f4f4f5]"
                  }`}
                >
                  {option.icon}
                  {option.label}
                  {option.id === value && (
                    <svg className="w-3 h-3 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-[#0c0d10] border ${
          isOpen ? "border-[#c9a962]/50" : "border-white/10"
        } rounded-xl transition-colors hover:border-[#c9a962]/30 ${
          variant === "compact" ? "text-xs" : "text-sm"
        }`}
      >
        <svg className="w-4 h-4 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span className="text-[#71717a]">{label}:</span>
        <span className="text-[#f4f4f5] font-medium">{selectedOption.label}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-4 h-4 text-[#52525b] ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 bg-[#0c0d10] border border-white/10 rounded-xl overflow-hidden z-50 min-w-full shadow-xl"
          >
            {options.map(option => (
              <button
                key={option.id}
                onClick={() => { onChange(option.id); setIsOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                  option.id === value
                    ? "bg-[#c9a962]/10 text-[#c9a962]"
                    : "text-[#a1a1aa] hover:bg-white/5 hover:text-[#f4f4f5]"
                }`}
              >
                {option.icon}
                <span className="flex-1 text-left">{option.label}</span>
                {option.id === value && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Preset sort options for articles
export const ARTICLE_SORT_OPTIONS: SortOption[] = [
  { id: "newest", label: "Najnowsze" },
  { id: "oldest", label: "Najstarsze" },
  { id: "popular", label: "Najpopularniejsze" },
  { id: "trending", label: "Trendy" },
];

