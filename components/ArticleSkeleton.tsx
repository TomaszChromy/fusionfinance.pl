"use client";

import { motion } from "framer-motion";

interface ArticleSkeletonProps {
  count?: number;
  showImage?: boolean;
  variant?: "default" | "featured" | "compact";
}

export default function ArticleSkeleton({ 
  count = 5, 
  showImage = true,
  variant = "default"
}: ArticleSkeletonProps) {
  
  if (variant === "featured") {
    return (
      <div className="space-y-6">
        {/* Featured large skeleton */}
        <div className="animate-pulse">
          <div className="aspect-[16/9] bg-white/5 rounded-2xl mb-4" />
          <div className="space-y-3">
            <div className="h-7 bg-white/5 rounded-lg w-3/4" />
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-2/3" />
            <div className="flex gap-3 mt-4">
              <div className="h-3 bg-white/5 rounded w-20" />
              <div className="h-3 bg-white/5 rounded w-16" />
            </div>
          </div>
        </div>
        
        {/* Smaller items */}
        {[...Array(count - 1)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4">
            <div className="w-24 h-20 bg-white/5 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]"
          >
            <div className="w-2 h-2 bg-white/10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-white/5 rounded w-full" />
              <div className="h-2.5 bg-white/5 rounded w-2/3" />
            </div>
            <div className="h-2.5 bg-white/5 rounded w-14" />
          </motion.div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="animate-pulse flex gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/5"
        >
          {showImage && (
            <div className="relative w-[120px] h-[90px] lg:w-[180px] lg:h-[120px] flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl animate-shimmer" />
            </div>
          )}
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="space-y-3">
              {/* Title */}
              <div className="space-y-2">
                <div className="h-5 bg-white/5 rounded-lg w-full" />
                <div className="h-5 bg-white/5 rounded-lg w-4/5" />
              </div>
              {/* Description */}
              <div className="space-y-1.5">
                <div className="h-3.5 bg-white/5 rounded w-full" />
                <div className="h-3.5 bg-white/5 rounded w-3/4" />
              </div>
            </div>
            {/* Meta */}
            <div className="flex items-center gap-3 mt-3">
              <div className="h-2.5 bg-white/5 rounded w-20" />
              <div className="w-1 h-1 bg-white/10 rounded-full" />
              <div className="h-2.5 bg-white/5 rounded w-16" />
            </div>
          </div>
          {/* Favorite button placeholder */}
          <div className="w-8 h-8 bg-white/5 rounded-full flex-shrink-0 self-center" />
        </motion.div>
      ))}
    </div>
  );
}

