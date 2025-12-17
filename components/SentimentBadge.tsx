"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SentimentData {
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  confidence: number;
}

interface SentimentBadgeProps {
  text: string;
  variant?: "inline" | "block";
}

export default function SentimentBadge({
  text,
  variant = "inline",
}: SentimentBadgeProps) {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeSentiment = async () => {
      try {
        const response = await fetch("/api/sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language: "pl" }),
        });

        if (response.ok) {
          const data = await response.json();
          setSentiment(data);
        }
      } catch (error) {
        console.error("Failed to analyze sentiment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (text && text.length > 10) {
      analyzeSentiment();
    } else {
      setLoading(false);
    }
  }, [text]);

  if (loading || !sentiment) {
    return null;
  }

  const colors: Record<string, { bg: string; border: string; icon: string; text: string }> = {
    positive: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      icon: "🟢",
      text: "text-green-400",
    },
    neutral: {
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
      icon: "⚪",
      text: "text-gray-400",
    },
    negative: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: "🔴",
      text: "text-red-400",
    },
  };

  const color = colors[sentiment.sentiment];

  const sentimentLabel: Record<string, string> = {
    positive: "Pozytywny",
    neutral: "Neutralny",
    negative: "Negatywny",
  };

  if (variant === "inline") {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${color.bg} ${color.border} ${color.text}`}
        title={`Sentiment: ${sentimentLabel[sentiment.sentiment]} (${Math.abs(sentiment.score * 100).toFixed(0)}%)`}
      >
        <span>{color.icon}</span>
        {sentimentLabel[sentiment.sentiment]}
      </motion.span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${color.bg} ${color.border}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{color.icon}</span>
          <div>
            <p className={`font-semibold text-sm ${color.text}`}>
              {sentimentLabel[sentiment.sentiment]} Sentiment
            </p>
            <p className="text-xs text-[#a1a1aa]">
              Score: {sentiment.score.toFixed(2)} • Confidence: {sentiment.confidence}%
            </p>
          </div>
        </div>
      </div>

      {/* Sentiment Bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${Math.round(((sentiment.score + 1) / 2) * 100)}%`,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${
            sentiment.sentiment === "positive"
              ? "bg-gradient-to-r from-green-500 to-green-400"
              : sentiment.sentiment === "negative"
              ? "bg-gradient-to-r from-red-500 to-red-400"
              : "bg-gradient-to-r from-gray-500 to-gray-400"
          }`}
        />
      </div>

      <div className="flex justify-between text-xs text-[#71717a] mt-2">
        <span>Negatywny</span>
        <span>Neutralny</span>
        <span>Pozytywny</span>
      </div>
    </motion.div>
  );
}
