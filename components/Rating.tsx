"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface RatingProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export default function Rating({
  value = 0,
  max = 5,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
  className = "",
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const displayValue = hoverValue ?? value;
  
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayValue;
        
        return (
          <motion.button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => !readonly && setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
            whileHover={!readonly ? { scale: 1.2 } : undefined}
            whileTap={!readonly ? { scale: 0.9 } : undefined}
            className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
          >
            <svg
              className={`${sizes[size]} ${
                isFilled ? "text-[#c9a962]" : "text-[#3f3f46]"
              } transition-colors`}
              fill={isFilled ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </motion.button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm text-[#71717a]">
          {value.toFixed(1)} / {max}
        </span>
      )}
    </div>
  );
}

// Star Rating Display (readonly with count)
export function StarRating({
  rating,
  count,
  className = "",
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Rating value={rating} readonly size="sm" />
      <span className="text-sm text-[#f4f4f5] font-medium">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-[#71717a]">({count} ocen)</span>
      )}
    </div>
  );
}

// Thumbs Rating (like/dislike)
export function ThumbsRating({
  likes,
  dislikes,
  userVote,
  onVote,
  className = "",
}: {
  likes: number;
  dislikes: number;
  userVote?: "like" | "dislike" | null;
  onVote?: (vote: "like" | "dislike") => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.button
        onClick={() => onVote?.("like")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === "like"
            ? "bg-[#4ade80]/20 text-[#4ade80]"
            : "bg-white/5 text-[#71717a] hover:text-[#4ade80]"
        }`}
      >
        <svg className="w-4 h-4" fill={userVote === "like" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span className="text-sm font-medium">{likes}</span>
      </motion.button>
      
      <motion.button
        onClick={() => onVote?.("dislike")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === "dislike"
            ? "bg-[#f87171]/20 text-[#f87171]"
            : "bg-white/5 text-[#71717a] hover:text-[#f87171]"
        }`}
      >
        <svg className="w-4 h-4 rotate-180" fill={userVote === "dislike" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span className="text-sm font-medium">{dislikes}</span>
      </motion.button>
    </div>
  );
}

