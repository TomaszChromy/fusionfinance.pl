"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Funkcje projektu zamiast fałszywych testimoniali
const FEATURES: Feature[] = [
  {
    id: "1",
    icon: "📊",
    title: "Agregacja RSS",
    description: "Automatyczne pobieranie i filtrowanie newsów z 6+ polskich portali finansowych: Bankier.pl, Money.pl, Parkiet, GPW i innych.",
  },
  {
    id: "2",
    icon: "💹",
    title: "Dane rynkowe",
    description: "Kursy walut NBP, indeksy giełdowe, kryptowaluty. Dane aktualizowane w czasie rzeczywistym z oficjalnych źródeł.",
  },
  {
    id: "3",
    icon: "📱",
    title: "PWA Ready",
    description: "Instaluj jako aplikację na telefonie. Działa offline, szybkie ładowanie, powiadomienia push o ważnych wydarzeniach.",
  },
  {
    id: "4",
    icon: "🔍",
    title: "Wyszukiwarka",
    description: "Przeszukuj archiwum artykułów po słowach kluczowych. Zapisuj ulubione i śledź historię czytania.",
  },
];

interface TestimonialsProps {
  variant?: "default" | "carousel" | "grid" | "compact";
  autoPlay?: boolean;
  className?: string;
}

export default function Testimonials({
  variant = "default",
  autoPlay = true,
  className = "",
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || variant === "grid") return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, variant]);

  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    const feature = FEATURES[currentIndex];
    return (
      <div className={`text-center ${className}`}>
        <p className="text-sm text-[#a1a1aa] mb-2">{feature.icon} {feature.title}</p>
        <p className="text-xs text-[#71717a]">{feature.description.slice(0, 80)}...</p>
      </div>
    );
  }

  // Default / Carousel - pokazuje funkcje projektu
  const feature = FEATURES[currentIndex];

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-[#0c0d10] border border-white/5 rounded-xl p-6"
        >
          {/* Feature icon */}
          <div className="text-3xl mb-3">{feature.icon}</div>

          <h4 className="text-sm font-medium text-[#f4f4f5] mb-2">{feature.title}</h4>

          <p className="text-sm text-[#a1a1aa] leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {FEATURES.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Pokaż funkcję ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? "bg-[#c9a962]" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-colors"
    >
      <div className="text-2xl mb-3">{feature.icon}</div>
      <h4 className="text-sm font-medium text-[#f4f4f5] mb-2">{feature.title}</h4>
      <p className="text-xs text-[#a1a1aa] leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

