"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positions = {
    top: {
      tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      arrow: "top-full left-1/2 -translate-x-1/2 border-t-[#1a1b1f] border-x-transparent border-b-transparent",
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 },
    },
    bottom: {
      tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
      arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-[#1a1b1f] border-x-transparent border-t-transparent",
      initial: { opacity: 0, y: -5 },
      animate: { opacity: 1, y: 0 },
    },
    left: {
      tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
      arrow: "left-full top-1/2 -translate-y-1/2 border-l-[#1a1b1f] border-y-transparent border-r-transparent",
      initial: { opacity: 0, x: 5 },
      animate: { opacity: 1, x: 0 },
    },
    right: {
      tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
      arrow: "right-full top-1/2 -translate-y-1/2 border-r-[#1a1b1f] border-y-transparent border-l-transparent",
      initial: { opacity: 0, x: -5 },
      animate: { opacity: 1, x: 0 },
    },
  };

  const pos = positions[position];

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={pos.initial}
            animate={pos.animate}
            exit={pos.initial}
            transition={{ duration: 0.15 }}
            className={`absolute z-[100] ${pos.tooltip}`}
          >
            <div className="px-3 py-2 bg-[#1a1b1f] border border-white/10 rounded-lg shadow-xl backdrop-blur-sm text-[12px] text-[#f4f4f5] whitespace-nowrap">
              {content}
            </div>
            <div className={`absolute w-0 h-0 border-[5px] ${pos.arrow}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// InfoTooltip with icon
export function InfoTooltip({ content, className = "" }: { content: ReactNode; className?: string }) {
  return (
    <Tooltip content={content} className={className}>
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 text-[#71717a] hover:bg-white/20 hover:text-[#a1a1aa] transition-colors cursor-help">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    </Tooltip>
  );
}

