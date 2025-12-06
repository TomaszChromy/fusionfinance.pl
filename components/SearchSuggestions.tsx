"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Suggestion {
  id: string;
  text: string;
  type: "search" | "article" | "asset" | "category";
  url?: string;
  meta?: string;
}

const SUGGESTIONS_DATA: Suggestion[] = [
  { id: "1", text: "EUR/PLN kurs", type: "asset", url: "/kursy-walut", meta: "4.28 PLN" },
  { id: "2", text: "Bitcoin cena", type: "asset", url: "/crypto", meta: "$42,567" },
  { id: "3", text: "WIG20 notowania", type: "asset", url: "/gielda", meta: "2,345.67" },
  { id: "4", text: "Stopy procentowe NBP", type: "article", url: "/analizy" },
  { id: "5", text: "Inflacja w Polsce", type: "article", url: "/analizy" },
  { id: "6", text: "Kryptowaluty", type: "category", url: "/crypto" },
  { id: "7", text: "Giełda", type: "category", url: "/gielda" },
  { id: "8", text: "Kursy walut", type: "category", url: "/kursy-walut" },
];

const TYPE_ICONS = {
  search: "🔍",
  article: "📄",
  asset: "📈",
  category: "📁",
};

interface SearchSuggestionsProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchSuggestions({
  className = "",
  placeholder = "Szukaj artykułów, kursów, aktywów...",
  onSearch,
}: SearchSuggestionsProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = SUGGESTIONS_DATA.filter(
        (s) => s.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else if (query) {
        onSearch?.(query);
        window.location.href = `/szukaj?q=${encodeURIComponent(query)}`;
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (suggestion: Suggestion) => {
    if (suggestion.url) {
      window.location.href = suggestion.url;
    }
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-[#f4f4f5] placeholder:text-[#52525b] focus:outline-none focus:border-[#c9a962]/50 focus:ring-1 focus:ring-[#c9a962]/20 transition-all"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525b]">🔍</span>
        {query && (
          <button
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute left-0 right-0 top-full mt-2 bg-[#0c0d10] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex ? "bg-white/5" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <span className="text-sm">{TYPE_ICONS[suggestion.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f4f4f5] truncate">{suggestion.text}</p>
                    <p className="text-[10px] text-[#52525b] capitalize">{suggestion.type}</p>
                  </div>
                  {suggestion.meta && (
                    <span className="text-xs text-[#c9a962] font-medium">{suggestion.meta}</span>
                  )}
                </button>
              ))}
              <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01]">
                <p className="text-[10px] text-[#52525b]">↑↓ nawigacja • Enter wybierz • Esc zamknij</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

