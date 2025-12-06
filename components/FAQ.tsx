"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const FINANCIAL_FAQ: FAQItem[] = [
  {
    question: "Skąd pochodzą dane o kursach walut?",
    answer: "Kursy walut pobieramy bezpośrednio z API Narodowego Banku Polskiego (NBP). Są to oficjalne kursy średnie publikowane codziennie w dni robocze.",
    category: "Dane",
  },
  {
    question: "Jak często aktualizowane są artykuły?",
    answer: "Artykuły są agregowane z wiodących polskich portali finansowych i aktualizowane automatycznie co 5 minut. Źródła obejmują Bankier.pl, Money.pl, Parkiet i inne.",
    category: "Treści",
  },
  {
    question: "Czy mogę zapisywać ulubione artykuły?",
    answer: "Tak! Kliknij ikonę serduszka przy artykule, aby dodać go do ulubionych. Twoje ulubione są przechowywane lokalnie w przeglądarce i dostępne w zakładce /ulubione.",
    category: "Funkcje",
  },
  {
    question: "Jak działa kalkulator procentu składanego?",
    answer: "Kalkulator oblicza końcową wartość inwestycji uwzględniając kapitalizację odsetek. Możesz wybrać kapitalizację roczną, kwartalną, miesięczną lub dzienną.",
    category: "Narzędzia",
  },
  {
    question: "Czy strona działa offline?",
    answer: "Tak, FusionFinance jest Progressive Web App (PWA). Po pierwszej wizycie strona jest cachowana i podstawowe funkcje działają bez połączenia z internetem.",
    category: "Techniczne",
  },
  {
    question: "Jak korzystać ze skrótów klawiszowych?",
    answer: "Naciśnij '?' aby wyświetlić listę dostępnych skrótów. Przykłady: '/' - szukaj, 'g h' - strona główna, 'd' - zmień motyw, 't' - na górę strony.",
    category: "Funkcje",
  },
  {
    question: "Czy oferujecie porady inwestycyjne?",
    answer: "Nie. FusionFinance to agregator wiadomości i narzędzi edukacyjnych. Nie udzielamy porad inwestycyjnych. Wszystkie decyzje inwestycyjne podejmuj po konsultacji z licencjonowanym doradcą.",
    category: "Prawne",
  },
  {
    question: "Jak mogę skontaktować się z zespołem?",
    answer: "Skorzystaj z formularza kontaktowego na stronie lub napisz na adres podany w stopce. Odpowiadamy zazwyczaj w ciągu 24-48 godzin.",
    category: "Kontakt",
  },
];

interface FAQProps {
  variant?: "default" | "compact" | "grouped";
  limit?: number;
  className?: string;
}

export default function FAQ({ variant = "default", limit, className = "" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(FINANCIAL_FAQ.map((item) => item.category))];
  
  const filteredFAQ = FINANCIAL_FAQ.filter(
    (item) => !selectedCategory || item.category === selectedCategory
  ).slice(0, limit);

  if (variant === "compact") {
    return (
      <div className={`space-y-2 ${className}`}>
        {filteredFAQ.slice(0, 4).map((item, index) => (
          <div key={index} className="text-xs">
            <span className="text-[#c9a962] font-medium">Q:</span>{" "}
            <span className="text-[#a1a1aa]">{item.question}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Category filter */}
      {variant === "grouped" && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !selectedCategory
                ? "bg-[#c9a962] text-[#08090c]"
                : "bg-white/5 text-[#a1a1aa] hover:bg-white/10"
            }`}
          >
            Wszystkie
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat || null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-[#c9a962] text-[#08090c]"
                  : "bg-white/5 text-[#a1a1aa] hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* FAQ items */}
      <div className="space-y-3">
        {filteredFAQ.map((item, index) => (
          <motion.div
            key={index}
            initial={false}
            className="bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden hover:border-[#c9a962]/20 transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                {item.category && (
                  <span className="px-2 py-0.5 bg-[#c9a962]/10 text-[#c9a962] text-[10px] rounded-full">
                    {item.category}
                  </span>
                )}
                <span className="text-sm font-medium text-[#f4f4f5]">{item.question}</span>
              </div>
              <motion.span
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                className="text-[#c9a962] text-sm"
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4">
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-sm text-[#a1a1aa] leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

