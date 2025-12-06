"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Marek Kowalski",
    role: "Inwestor indywidualny",
    content: "FusionFinance to najlepsze źródło informacji finansowych. Codziennie sprawdzam kursy i analizy przed podejmowaniem decyzji inwestycyjnych.",
    rating: 5,
  },
  {
    id: "2",
    name: "Anna Nowak",
    role: "Analityk finansowy",
    company: "Bank XYZ",
    content: "Profesjonalne podejście do agregacji newsów. Interfejs jest intuicyjny, a dane zawsze aktualne. Polecam każdemu zainteresowanemu rynkami.",
    rating: 5,
  },
  {
    id: "3",
    name: "Piotr Wiśniewski",
    role: "Trader",
    content: "Kalkulatory finansowe i słownik pojęć są nieocenione dla początkujących. Korzystam codziennie z tickera giełdowego.",
    rating: 4,
  },
  {
    id: "4",
    name: "Katarzyna Dąbrowska",
    role: "Przedsiębiorca",
    content: "Świetne narzędzie do śledzenia kursów walut. Kalendarz ekonomiczny pomaga mi planować transakcje zagraniczne.",
    rating: 5,
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
      setCurrentIndex((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, variant]);

  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        {MOCK_TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    const testimonial = MOCK_TESTIMONIALS[currentIndex];
    return (
      <div className={`text-center ${className}`}>
        <p className="text-sm text-[#a1a1aa] italic mb-2">"{testimonial.content.slice(0, 100)}..."</p>
        <p className="text-xs text-[#c9a962]">— {testimonial.name}</p>
      </div>
    );
  }

  // Default / Carousel
  const testimonial = MOCK_TESTIMONIALS[currentIndex];

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-[#0c0d10] border border-white/5 rounded-xl p-6"
        >
          {/* Quote icon */}
          <div className="text-4xl text-[#c9a962]/20 mb-4">"</div>
          
          <p className="text-sm text-[#a1a1aa] leading-relaxed mb-4">
            {testimonial.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a962] to-[#9a7b3c] flex items-center justify-center text-[#08090c] font-medium">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-[#f4f4f5]">{testimonial.name}</p>
                <p className="text-xs text-[#71717a]">
                  {testimonial.role}
                  {testimonial.company && ` • ${testimonial.company}`}
                </p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < testimonial.rating ? "text-[#c9a962]" : "text-[#52525b]"}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {MOCK_TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? "bg-[#c9a962]" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-colors"
    >
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xs ${i < testimonial.rating ? "text-[#c9a962]" : "text-[#52525b]"}`}>★</span>
        ))}
      </div>
      <p className="text-sm text-[#a1a1aa] leading-relaxed mb-4">"{testimonial.content}"</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a962] to-[#9a7b3c] flex items-center justify-center text-[#08090c] text-xs font-medium">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-medium text-[#f4f4f5]">{testimonial.name}</p>
          <p className="text-[10px] text-[#71717a]">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

