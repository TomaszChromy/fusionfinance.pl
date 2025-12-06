"use client";

import { motion } from "framer-motion";

interface TrendingBadgeProps {
  rank?: number;
  type?: "hot" | "trending" | "new" | "featured";
  size?: "sm" | "md";
  className?: string;
}

const badges = {
  hot: {
    label: "HOT",
    icon: "🔥",
    bg: "bg-gradient-to-r from-red-500/20 to-orange-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
  },
  trending: {
    label: "Trending",
    icon: "📈",
    bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  new: {
    label: "Nowe",
    icon: "✨",
    bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  featured: {
    label: "Wyróżnione",
    icon: "⭐",
    bg: "bg-gradient-to-r from-[#c9a962]/20 to-amber-500/20",
    border: "border-[#c9a962]/30",
    text: "text-[#c9a962]",
  },
};

export default function TrendingBadge({ 
  rank, 
  type = "trending",
  size = "sm",
  className = ""
}: TrendingBadgeProps) {
  const badge = badges[type];
  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-[10px]" 
    : "px-3 py-1 text-[11px]";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1 rounded-full border backdrop-blur-sm ${badge.bg} ${badge.border} ${badge.text} ${sizeClasses} font-medium tracking-wide uppercase ${className}`}
    >
      <span className="text-[12px]">{badge.icon}</span>
      {rank && <span className="font-bold">#{rank}</span>}
      <span>{badge.label}</span>
    </motion.span>
  );
}

// Helper function to determine badge type based on article data
export function getBadgeType(article: {
  date: string;
  views?: number;
}): "hot" | "trending" | "new" | "featured" | null {
  const now = new Date();
  const articleDate = new Date(article.date);
  const hoursSincePublished = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);

  // New if published within last 2 hours
  if (hoursSincePublished < 2) return "new";
  
  // Hot if published within last 6 hours
  if (hoursSincePublished < 6) return "hot";

  // Trending if has high views (if available)
  if (article.views && article.views > 1000) return "trending";

  return null;
}

