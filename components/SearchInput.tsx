"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  recentSearches?: string[];
  loading?: boolean;
  variant?: "default" | "large" | "minimal";
  className?: string;
}

export default function SearchInput({
  value = "",
  onChange,
  onSearch,
  placeholder = "Szukaj artykułów...",
  suggestions = [],
  recentSearches = [],
  loading = false,
  variant = "default",
  className = "",
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setShowSuggestions(newValue.length > 0 || recentSearches.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(inputValue);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange?.(suggestion);
    onSearch?.(suggestion);
    setShowSuggestions(false);
  };

  const sizeClasses = {
    default: "h-11 text-sm",
    large: "h-14 text-base",
    minimal: "h-9 text-sm",
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 5);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center ${sizeClasses[variant]} bg-[#0c0d10] border ${
          isFocused ? "border-[#c9a962]/50" : "border-white/10"
        } rounded-xl transition-colors`}>
          {/* Search Icon */}
          <div className="pl-4 text-[#71717a]">
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-3 text-[#f4f4f5] placeholder-[#52525b] outline-none"
          />

          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(""); onChange?.(""); }}
              className="px-3 text-[#71717a] hover:text-[#f4f4f5] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {variant !== "minimal" && (
            <button
              type="submit"
              className="h-full px-4 bg-[#c9a962] hover:bg-[#b8994f] text-[#08090c] font-medium rounded-r-xl transition-colors"
            >
              Szukaj
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (filteredSuggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0c0d10] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl"
          >
            {recentSearches.length > 0 && inputValue.length === 0 && (
              <div className="p-3 border-b border-white/5">
                <p className="text-[10px] text-[#52525b] uppercase tracking-wider mb-2">Ostatnie wyszukiwania</p>
                {recentSearches.slice(0, 3).map((search, i) => (
                  <button key={i} onClick={() => handleSuggestionClick(search)} className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {search}
                  </button>
                ))}
              </div>
            )}
            {filteredSuggestions.length > 0 && (
              <div className="p-2">
                {filteredSuggestions.map((suggestion, i) => (
                  <button key={i} onClick={() => handleSuggestionClick(suggestion)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/5 rounded-lg transition-colors text-left">
                    <svg className="w-4 h-4 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

