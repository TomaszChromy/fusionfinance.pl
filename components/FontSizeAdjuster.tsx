"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

interface FontSizeAdjusterProps {
  targetSelector?: string;
  minSize?: number;
  maxSize?: number;
  step?: number;
  defaultSize?: number;
  className?: string;
}

const STORAGE_KEY = "fusionfinance_font_size";

export default function FontSizeAdjuster({
  targetSelector = ".prose",
  minSize = 14,
  maxSize = 22,
  step = 2,
  defaultSize = 16,
  className = "",
}: FontSizeAdjusterProps) {
  const [fontSize, setFontSize] = useState(defaultSize);
  const [mounted, setMounted] = useState(false);

  // Load saved font size
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const size = parseInt(saved, 10);
        if (size >= minSize && size <= maxSize) {
          setFontSize(size);
        }
      }
    } catch {}
  }, [minSize, maxSize]);

  // Apply font size to target elements
  useEffect(() => {
    if (!mounted) return;
    
    const elements = document.querySelectorAll(targetSelector);
    elements.forEach((el) => {
      (el as HTMLElement).style.fontSize = `${fontSize}px`;
    });

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, fontSize.toString());
    } catch {}
  }, [fontSize, targetSelector, mounted]);

  const decrease = () => {
    setFontSize((prev) => Math.max(minSize, prev - step));
  };

  const increase = () => {
    setFontSize((prev) => Math.min(maxSize, prev + step));
  };

  const reset = () => {
    setFontSize(defaultSize);
  };

  if (!mounted) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Tooltip content="Zmniejsz czcionkę">
        <button
          onClick={decrease}
          disabled={fontSize <= minSize}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </Tooltip>

      <Tooltip content="Resetuj rozmiar">
        <motion.button
          onClick={reset}
          whileTap={{ scale: 0.95 }}
          className="px-2 py-1 min-w-[40px] text-center text-[12px] font-medium text-[#c9a962] hover:bg-white/5 rounded-lg transition-colors"
        >
          {fontSize}px
        </motion.button>
      </Tooltip>

      <Tooltip content="Powiększ czcionkę">
        <button
          onClick={increase}
          disabled={fontSize >= maxSize}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
}

// Compact version with just icon buttons
export function FontSizeButtons({ className = "" }: { className?: string }) {
  const [fontSize, setFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFontSize(parseInt(saved, 10));
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const elements = document.querySelectorAll(".prose");
    elements.forEach((el) => {
      (el as HTMLElement).style.fontSize = `${fontSize}px`;
    });
    try {
      localStorage.setItem(STORAGE_KEY, fontSize.toString());
    } catch {}
  }, [fontSize, mounted]);

  if (!mounted) return null;

  return (
    <div className={`flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 ${className}`}>
      <button
        onClick={() => setFontSize((prev) => Math.max(14, prev - 2))}
        className="p-1.5 hover:bg-white/10 rounded text-[11px] font-medium text-[#a1a1aa]"
      >
        A-
      </button>
      <button
        onClick={() => setFontSize((prev) => Math.min(22, prev + 2))}
        className="p-1.5 hover:bg-white/10 rounded text-[13px] font-medium text-[#a1a1aa]"
      >
        A+
      </button>
    </div>
  );
}

