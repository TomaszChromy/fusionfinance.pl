"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface NewsCardProps {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  source?: string;
  date: string;
  category?: string;
  href: string;
  variant?: "default" | "featured" | "compact" | "horizontal" | "minimal";
  priority?: "normal" | "breaking" | "trending";
  className?: string;
}

export default function NewsCard({
  title,
  excerpt,
  imageUrl,
  source,
  date,
  category,
  href,
  variant = "default",
  priority = "normal",
  className = "",
}: NewsCardProps) {
  const priorityBadge = {
    breaking: { label: "PILNE", bg: "bg-[#ef4444]", text: "text-white" },
    trending: { label: "TRENDING", bg: "bg-[#c9a962]", text: "text-[#08090c]" },
    normal: null,
  };

  const badge = priorityBadge[priority];

  if (variant === "minimal") {
    return (
      <Link href={href} className={`block group ${className}`}>
        <div className="flex items-start gap-3 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2">
              {title}
            </h4>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#52525b]">
              {source && <span>{source}</span>}
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
          {badge && (
            <span className={`px-1.5 py-0.5 ${badge.bg} ${badge.text} text-[8px] font-bold rounded`}>
              {badge.label}
            </span>
          )}
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className={`block group ${className}`}>
        <motion.div
          whileHover={{ x: 4 }}
          className="flex items-center gap-3 p-3 bg-[#0c0d10] border border-white/5 rounded-lg hover:border-[#c9a962]/20 transition-colors"
        >
          {imageUrl && (
            <img src={imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2">
              {title}
            </h4>
            <p className="text-[10px] text-[#52525b] mt-1">{date}</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={href} className={`block group ${className}`}>
        <motion.div
          whileHover={{ y: -2 }}
          className="flex gap-4 p-4 bg-[#0c0d10] border border-white/5 rounded-xl hover:border-[#c9a962]/20 transition-all"
        >
          {imageUrl && (
            <img src={imageUrl} alt="" className="w-32 h-24 rounded-lg object-cover flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            {(category || badge) && (
              <div className="flex items-center gap-2 mb-2">
                {category && <span className="text-[10px] text-[#c9a962] uppercase tracking-wider">{category}</span>}
                {badge && <span className={`px-1.5 py-0.5 ${badge.bg} ${badge.text} text-[8px] font-bold rounded`}>{badge.label}</span>}
              </div>
            )}
            <h3 className="text-base font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2 mb-2">
              {title}
            </h3>
            {excerpt && <p className="text-xs text-[#71717a] line-clamp-2 mb-2">{excerpt}</p>}
            <div className="flex items-center gap-2 text-[10px] text-[#52525b]">
              {source && <span>{source}</span>}
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className={`block group ${className}`}>
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-2xl bg-[#0c0d10] border border-white/5 hover:border-[#c9a962]/20 transition-all"
        >
          {imageUrl && (
            <div className="relative h-48 overflow-hidden">
              <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent" />
            </div>
          )}
          <div className="p-5">
            {(category || badge) && (
              <div className="flex items-center gap-2 mb-3">
                {category && <span className="text-[10px] text-[#c9a962] uppercase tracking-wider font-medium">{category}</span>}
                {badge && <span className={`px-2 py-0.5 ${badge.bg} ${badge.text} text-[10px] font-bold rounded-full`}>{badge.label}</span>}
              </div>
            )}
            <h3 className="text-lg font-serif font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2 mb-2">
              {title}
            </h3>
            {excerpt && <p className="text-sm text-[#71717a] line-clamp-2 mb-3">{excerpt}</p>}
            <div className="flex items-center gap-2 text-xs text-[#52525b]">
              {source && <span className="font-medium">{source}</span>}
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={href} className={`block group ${className}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden hover:border-[#c9a962]/20 transition-all"
      >
        {imageUrl && (
          <div className="relative h-40 overflow-hidden">
            <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-4">
          {(category || badge) && (
            <div className="flex items-center gap-2 mb-2">
              {category && <span className="text-[10px] text-[#c9a962] uppercase tracking-wider">{category}</span>}
              {badge && <span className={`px-1.5 py-0.5 ${badge.bg} ${badge.text} text-[8px] font-bold rounded`}>{badge.label}</span>}
            </div>
          )}
          <h3 className="text-sm font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-[#52525b]">
            {source && <span>{source}</span>}
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

