"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ArticleSummaryProps {
  articleTitle: string;
  articleContent: string;
}

export default function ArticleSummary({
  articleTitle,
  articleContent,
}: ArticleSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    if (summary) {
      setIsExpanded(!isExpanded);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
          maxLength: 200,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      setIsExpanded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate summary"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <button
        onClick={generateSummary}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9a962]/20 to-transparent border border-[#c9a962]/30 hover:border-[#c9a962]/50 text-[#c9a962] hover:text-[#e4d4a5] text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {loading ? "Generuję..." : summary && isExpanded ? "Ukryj streszczenie" : "AI Streszczenie"}
      </button>

      <AnimatePresence>
        {isExpanded && summary && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="mt-3 p-4 rounded-lg bg-gradient-to-r from-[#c9a962]/10 to-transparent border border-[#c9a962]/20"
          >
            <p className="text-sm text-[#a1a1aa] leading-relaxed">{summary}</p>
            <p className="text-xs text-[#71717a] mt-3">
              💡 Streszczenie wygenerowane przez AI
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
