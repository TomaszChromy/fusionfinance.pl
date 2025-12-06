"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category?: string;
  relatedTerms?: string[];
}

const FINANCIAL_TERMS: GlossaryTerm[] = [
  { term: "Akcja", definition: "Papier wartościowy reprezentujący część kapitału zakładowego spółki akcyjnej.", category: "Giełda", relatedTerms: ["Dywidenda", "IPO"] },
  { term: "Bear Market", definition: "Rynek niedźwiedzia - okres spadków na giełdzie, zazwyczaj o 20% lub więcej od szczytu.", category: "Rynki", relatedTerms: ["Bull Market", "Korekta"] },
  { term: "Bull Market", definition: "Rynek byka - okres wzrostów na giełdzie charakteryzujący się optymizmem inwestorów.", category: "Rynki", relatedTerms: ["Bear Market"] },
  { term: "Blockchain", definition: "Rozproszona baza danych przechowująca rejestr transakcji w formie łańcucha bloków.", category: "Crypto", relatedTerms: ["Bitcoin", "Smart Contract"] },
  { term: "Dywidenda", definition: "Część zysku spółki wypłacana akcjonariuszom proporcjonalnie do posiadanych akcji.", category: "Giełda", relatedTerms: ["Akcja"] },
  { term: "ETF", definition: "Exchange Traded Fund - fundusz inwestycyjny notowany na giełdzie, śledzący określony indeks.", category: "Inwestycje", relatedTerms: ["Indeks", "Akcja"] },
  { term: "FOMO", definition: "Fear Of Missing Out - strach przed utratą okazji inwestycyjnej, często prowadzący do nieprzemyślanych decyzji.", category: "Psychologia", relatedTerms: ["FUD"] },
  { term: "FUD", definition: "Fear, Uncertainty, Doubt - strategia szerzenia strachu i wątpliwości na rynku.", category: "Psychologia", relatedTerms: ["FOMO"] },
  { term: "Inflacja", definition: "Wzrost ogólnego poziomu cen dóbr i usług w gospodarce powodujący spadek siły nabywczej pieniądza.", category: "Makroekonomia", relatedTerms: ["Deflacja", "Stopy procentowe"] },
  { term: "IPO", definition: "Initial Public Offering - pierwsza oferta publiczna, debiut spółki na giełdzie.", category: "Giełda", relatedTerms: ["Akcja"] },
  { term: "Korekta", definition: "Krótkoterminowy spadek cen aktywów po okresie wzrostów, zazwyczaj 10-20%.", category: "Rynki" },
  { term: "Leverage", definition: "Dźwignia finansowa - wykorzystanie pożyczonych środków do zwiększenia potencjalnych zysków (i strat).", category: "Trading" },
  { term: "Płynność", definition: "Możliwość szybkiego kupna lub sprzedaży aktywa bez znaczącego wpływu na jego cenę.", category: "Rynki" },
  { term: "P/E Ratio", definition: "Wskaźnik cena/zysk - stosunek ceny akcji do zysku netto przypadającego na jedną akcję.", category: "Analiza", relatedTerms: ["Akcja"] },
  { term: "Staking", definition: "Blokowanie kryptowalut w celu wsparcia sieci blockchain w zamian za nagrody.", category: "Crypto", relatedTerms: ["Blockchain"] },
  { term: "Stop Loss", definition: "Zlecenie automatycznej sprzedaży aktywa gdy jego cena spadnie do określonego poziomu.", category: "Trading" },
  { term: "Spread", definition: "Różnica między ceną kupna (ask) a ceną sprzedaży (bid) instrumentu finansowego.", category: "Trading" },
  { term: "Volatility", definition: "Zmienność - miara wahań ceny aktywa w danym okresie. Wysoka zmienność = większe ryzyko.", category: "Rynki", relatedTerms: ["Korekta"] },
];

interface GlossaryProps {
  variant?: "default" | "compact" | "search";
  className?: string;
}

export default function Glossary({ variant = "default", className = "" }: GlossaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(FINANCIAL_TERMS.map((t) => t.category).filter(Boolean));
    return ["Wszystkie", ...Array.from(cats)] as string[];
  }, []);

  const filteredTerms = useMemo(() => {
    return FINANCIAL_TERMS.filter((term) => {
      const matchesSearch = !searchQuery || 
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === "Wszystkie" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (variant === "compact") {
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <h3 className="text-sm font-medium text-[#f4f4f5] mb-3">📚 Słownik pojęć</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
          {FINANCIAL_TERMS.slice(0, 8).map((term) => (
            <div key={term.term} className="text-xs">
              <span className="text-[#c9a962] font-medium">{term.term}</span>
              <span className="text-[#71717a]"> - {term.definition.slice(0, 60)}...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl ${className}`}>
      {/* Header & Search */}
      <div className="p-5 border-b border-white/5">
        <h2 className="text-lg font-medium text-[#f4f4f5] mb-4">📚 Słownik finansowy</h2>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj pojęcia..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[#c9a962]/50"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "Wszystkie" ? null : cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                (cat === "Wszystkie" && !selectedCategory) || selectedCategory === cat
                  ? "bg-[#c9a962] text-[#08090c]"
                  : "bg-white/5 text-[#a1a1aa] hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms list */}
      <div className="max-h-96 overflow-y-auto">
        {filteredTerms.length === 0 ? (
          <div className="p-8 text-center text-[#52525b] text-sm">
            Nie znaleziono pojęć
          </div>
        ) : (
          filteredTerms.map((term) => (
            <motion.div
              key={term.term}
              layout
              className="border-b border-white/5 last:border-b-0"
            >
              <button
                onClick={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#f4f4f5]">{term.term}</span>
                  {term.category && (
                    <span className="px-2 py-0.5 bg-[#c9a962]/10 text-[#c9a962] text-[10px] rounded-full">
                      {term.category}
                    </span>
                  )}
                </div>
                <motion.span
                  animate={{ rotate: expandedTerm === term.term ? 180 : 0 }}
                  className="text-[#52525b]"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {expandedTerm === term.term && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-[#a1a1aa] mb-2">{term.definition}</p>
                      {term.relatedTerms && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[10px] text-[#52525b]">Powiązane:</span>
                          {term.relatedTerms.map((related) => (
                            <button
                              key={related}
                              onClick={() => { setSearchQuery(related); setExpandedTerm(null); }}
                              className="text-[10px] text-[#c9a962] hover:underline"
                            >
                              {related}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

