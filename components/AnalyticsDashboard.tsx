"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "./Card";
import AnimatedCounter from "./AnimatedCounter";

interface AnalyticsData {
  range: string;
  period: {
    start: string;
    end: string;
  };
  totalViews: number;
  uniqueUsers: number;
  totalArticleViews: number;
  avgDuration: number;
  bounceRate: number;
  topArticles: Array<{
    articleId: string;
    title: string;
    views: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"1d" | "7d" | "30d" | "90d">("7d");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics/stats?range=${range}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [range]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gradient-to-r from-[#c9a962]/20 to-transparent rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header z wyborem zakresu */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-medium text-[#f4f4f5] mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-sm text-[#71717a]">
            {new Date(stats.period.start).toLocaleDateString("pl-PL")} -{" "}
            {new Date(stats.period.end).toLocaleDateString("pl-PL")}
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
          {(["1d", "7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wide transition-all ${
                range === r
                  ? "bg-[#c9a962] text-black"
                  : "text-[#a1a1aa] hover:text-[#f4f4f5]"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Views */}
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717a] uppercase tracking-[0.1em]">
                Page Views
              </span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-serif font-medium text-[#f4f4f5]">
              <AnimatedCounter value={stats.totalViews} />
            </div>
          </div>
        </Card>

        {/* Unique Users */}
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717a] uppercase tracking-[0.1em]">
                Unique Users
              </span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm6-12h-2m0 0h-2v2m2-2v2" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-serif font-medium text-[#f4f4f5]">
              <AnimatedCounter value={stats.uniqueUsers} />
            </div>
          </div>
        </Card>

        {/* Avg Duration */}
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717a] uppercase tracking-[0.1em]">
                Avg Duration
              </span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-serif font-medium text-[#f4f4f5]">
              {Math.round(stats.avgDuration)}
              <span className="text-sm text-[#71717a] ml-1">sec</span>
            </div>
          </div>
        </Card>

        {/* Bounce Rate */}
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717a] uppercase tracking-[0.1em]">
                Bounce Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ef4444] to-[#dc2626] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-serif font-medium text-[#f4f4f5]">
              {stats.bounceRate.toFixed(1)}
              <span className="text-sm text-[#71717a] ml-1">%</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Top Articles */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 lg:p-8">
          <h3 className="text-lg font-serif font-medium text-[#f4f4f5] mb-6">
            🔝 Top Articles
          </h3>
          <div className="space-y-4">
            {stats.topArticles.length > 0 ? (
              stats.topArticles.map((article, index) => (
                <motion.div
                  key={article.articleId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start justify-between p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5 hover:border-white/10 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-[#c9a962] bg-[#c9a962]/20 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <p className="text-sm text-[#f4f4f5] truncate group-hover:text-[#c9a962] transition-colors">
                        {article.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-lg font-serif font-medium text-[#c9a962]">
                      {article.views}
                    </span>
                    <p className="text-xs text-[#71717a]">views</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-[#71717a] py-8">
                Brak danych o artykułach
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
