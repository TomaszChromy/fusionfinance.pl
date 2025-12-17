"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Recommendation {
  articleId: string;
  title: string;
  views: number;
  reason: string;
}

interface RecommendationsProps {
  limit?: number;
}

export default function RecommendedArticles({ limit = 5 }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`/api/recommendations?limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gradient-to-r from-[#c9a962]/20 to-transparent rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
        <h3 className="text-lg font-serif font-medium text-[#f4f4f5]">
          💡 Rekomendacje dla Ciebie
        </h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((article, index) => (
          <motion.div
            key={article.articleId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/artykul/${article.articleId}`}>
              <div className="group p-4 rounded-lg border border-white/5 hover:border-[#c9a962]/50 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  <svg
                    className="w-4 h-4 text-[#71717a] group-hover:text-[#c9a962] flex-shrink-0 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="text-xs text-[#71717a]">
                  {article.reason} • {article.views} views
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
