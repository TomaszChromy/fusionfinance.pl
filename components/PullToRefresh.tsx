"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  className?: string;
}

export default function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  className = "",
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pullDistance = useMotionValue(0);
  
  const opacity = useTransform(pullDistance, [0, threshold], [0, 1]);
  const rotate = useTransform(pullDistance, [0, threshold], [0, 360]);
  const scale = useTransform(pullDistance, [0, threshold / 2, threshold], [0.5, 0.8, 1]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull-to-refresh when at top of page
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY;
        setCanPull(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0 && window.scrollY <= 0) {
        // Resistance effect - pull gets harder as you go further
        const resistance = 0.4;
        const distance = Math.min(diff * resistance, threshold * 1.5);
        pullDistance.set(distance);
        
        if (diff > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!canPull) return;

      const currentPull = pullDistance.get();
      
      if (currentPull >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        animate(pullDistance, threshold, { duration: 0.2 });
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      animate(pullDistance, 0, { duration: 0.3 });
      setCanPull(false);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [canPull, isRefreshing, onRefresh, pullDistance, threshold]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull indicator */}
      <motion.div
        style={{ 
          height: pullDistance,
          opacity,
        }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#c9a962]/10 to-transparent z-50"
      >
        <motion.div
          style={{ rotate, scale }}
          className={`w-8 h-8 rounded-full border-2 border-[#c9a962] border-t-transparent ${
            isRefreshing ? "animate-spin" : ""
          }`}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: pullDistance }}
      >
        {children}
      </motion.div>
    </div>
  );
}

