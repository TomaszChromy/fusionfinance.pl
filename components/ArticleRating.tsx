"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArticleRatingProps {
  articleId: string;
  onRate?: (rating: "helpful" | "not_helpful") => void;
  className?: string;
}

const RATINGS_KEY = "fusionfinance_article_ratings";

export default function ArticleRating({ articleId, onRate, className = "" }: ArticleRatingProps) {
  const [rating, setRating] = useState<"helpful" | "not_helpful" | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  // Load rating from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RATINGS_KEY);
      if (stored) {
        const ratings = JSON.parse(stored);
        if (ratings[articleId]) {
          setRating(ratings[articleId]);
        }
      }
    } catch {}
  }, [articleId]);

  const handleRate = (newRating: "helpful" | "not_helpful") => {
    setRating(newRating);
    setShowThanks(true);
    
    // Save to localStorage
    try {
      const stored = localStorage.getItem(RATINGS_KEY);
      const ratings = stored ? JSON.parse(stored) : {};
      ratings[articleId] = newRating;
      localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    } catch {}

    onRate?.(newRating);
    setTimeout(() => setShowThanks(false), 3000);
  };

  return (
    <div className={`${className}`}>
      <AnimatePresence mode="wait">
        {showThanks ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-green-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[13px]">Dziękujemy za opinię!</span>
          </motion.div>
        ) : rating ? (
          <motion.div
            key="rated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[#71717a]"
          >
            <span className="text-[12px]">
              Oceniono jako {rating === "helpful" ? "pomocne" : "mało pomocne"}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <span className="text-[13px] text-[#a1a1aa]">Czy ten artykuł był pomocny?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRate("helpful")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-[12px] font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                Tak
              </button>
              <button
                onClick={() => handleRate("not_helpful")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-[12px] font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                Nie
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

