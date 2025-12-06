"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyButtonProps {
  text: string;
  label?: string;
  showLabel?: boolean;
  variant?: "default" | "minimal" | "pill";
  onCopy?: () => void;
  className?: string;
}

export default function CopyButton({
  text,
  label = "Kopiuj",
  showLabel = true,
  variant = "default",
  onCopy,
  className = ""
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const variants = {
    default: "px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-lg",
    minimal: "p-2 hover:bg-white/5 rounded-lg",
    pill: "px-4 py-1.5 bg-[#c9a962]/10 hover:bg-[#c9a962]/20 border border-[#c9a962]/30 rounded-full",
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-2 transition-all duration-200 ${variants[variant]} ${className}`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.svg
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-4 h-4 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </motion.svg>
        ) : (
          <motion.svg
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-4 h-4 text-[#a1a1aa]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </motion.svg>
        )}
      </AnimatePresence>
      {showLabel && (
        <span className={`text-[13px] font-medium ${copied ? "text-green-400" : "text-[#a1a1aa]"}`}>
          {copied ? "Skopiowano!" : label}
        </span>
      )}
    </motion.button>
  );
}

// Hook for programmatic copying
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  };

  return { copy, copied };
}

