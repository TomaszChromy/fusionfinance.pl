"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  link: string;
  description: string;
  date: string;
  source: string;
}

interface SearchBarProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export default function SearchBar({ onClose, isOpen = true }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { getRssApiUrl } = await import("@/lib/api");
        const apiUrl = getRssApiUrl("all", 50);

        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          const filtered = (data.items || []).filter((item: SearchResult) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 8);
          setResults(filtered);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/szukaj?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const params = new URLSearchParams({
      title: result.title,
      desc: result.description || "",
      content: result.description || "",
      date: result.date,
      source: result.link,
      image: "",
    });
    router.push(`/artykul/?${params.toString()}`);
    setShowResults(false);
    if (onClose) onClose();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj artykułów, tematów, słów kluczowych..."
          className="w-full pl-12 pr-12 py-4 bg-[#0c0d10] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#c9a962]/50 focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
        />

        {/* Loading / Clear */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <div className="w-5 h-5 border-2 border-[#c9a962]/30 border-t-[#c9a962] rounded-full animate-spin" />
          )}
          {query && !loading && (
            <button type="button" onClick={() => setQuery("")} className="text-[#71717a] hover:text-[#c9a962] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Results Dropdown */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0c0d10] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
          >
            <div className="p-2">
              <p className="text-[10px] text-[#71717a] uppercase tracking-wider px-3 py-2">
                Znaleziono {results.length} wyników
              </p>
              {results.map((result, index) => (
                <button
                  key={result.link + index}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-3 py-3 hover:bg-white/5 rounded-lg transition-colors group"
                >
                  <h4 className="text-sm font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-1">
                    {result.title}
                  </h4>
                  <p className="text-xs text-[#71717a] mt-1 line-clamp-1">
                    {result.description}
                  </p>
                </button>
              ))}
            </div>
            <div className="border-t border-white/5 p-3">
              <button
                onClick={handleSearch}
                className="w-full py-2 text-center text-sm text-[#c9a962] hover:text-[#e4d4a5] transition-colors"
              >
                Zobacz wszystkie wyniki dla &ldquo;{query}&rdquo; →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
