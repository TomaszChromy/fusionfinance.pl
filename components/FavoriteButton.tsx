"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFavorites, generateArticleId, FavoriteArticle } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  article: Omit<FavoriteArticle, "id" | "savedAt">;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function FavoriteButton({
  article,
  size = "md",
  showLabel = false,
  className = "",
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite, isLoaded } = useFavorites();
  
  const articleId = generateArticleId(article.title, article.source);
  const isSaved = isLoaded && isFavorite(articleId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ ...article, id: articleId });
  };

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (!isLoaded) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-white/5 animate-pulse ${className}`} />
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center gap-1.5
        transition-all duration-300 group relative
        ${isSaved 
          ? "bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171]" 
          : "bg-white/5 border border-white/10 text-[#71717a] hover:text-[#f87171] hover:border-[#f87171]/30 hover:bg-[#f87171]/5"
        }
        ${className}
      `}
      aria-label={isSaved ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      title={isSaved ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
    >
      <AnimatePresence mode="wait">
        {isSaved ? (
          <motion.svg
            key="filled"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className={iconSizes[size]}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </motion.svg>
        ) : (
          <motion.svg
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={iconSizes[size]}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </motion.svg>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className="text-xs font-medium">
          {isSaved ? "Zapisano" : "Zapisz"}
        </span>
      )}

      {/* Pulse effect on save */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-[#f87171]/30"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

