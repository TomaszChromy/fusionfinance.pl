"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Analysis {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  author: string;
  readTime: number;
  isPremium: boolean;
  isLocked: boolean;
}

const categoryColors: Record<string, string> = {
  stocks: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  crypto: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  forex: "bg-green-500/20 text-green-400 border-green-500/30",
  macro: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const categoryLabels: Record<string, string> = {
  stocks: "Akcje",
  crypto: "Krypto",
  forex: "Forex",
  macro: "Makro",
};

export default function PremiumAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const url = filter ? `/api/premium/analyses?category=${filter}` : "/api/premium/analyses";
        const res = await fetch(url);
        const data = await res.json();
        setAnalyses(data.analyses || []);
        setHasPremium(data.hasPremium);
      } catch (error) {
        console.error("Failed to fetch analyses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, [filter]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-[#1a1a2e] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            filter === null ? "bg-[#c9a962] text-black" : "bg-[#2a2a3e] text-white hover:bg-[#3a3a4e]"
          }`}
        >
          Wszystkie
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === key ? "bg-[#c9a962] text-black" : "bg-[#2a2a3e] text-white hover:bg-[#3a3a4e]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Analyses Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {analyses.map((analysis, i) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-[#1a1a2e] border border-[#c9a962]/20 rounded-lg p-5 ${
              analysis.isLocked ? "opacity-80" : ""
            }`}
          >
            {analysis.isLocked && (
              <div className="absolute top-3 right-3 bg-[#c9a962] text-black text-xs px-2 py-1 rounded font-medium">
                🔒 Premium
              </div>
            )}

            <span className={`inline-block px-2 py-0.5 rounded text-xs border mb-3 ${categoryColors[analysis.category]}`}>
              {categoryLabels[analysis.category]}
            </span>

            <h3 className="text-white font-semibold mb-2 pr-16">{analysis.title}</h3>
            <p className="text-[#a1a1aa] text-sm mb-4">{analysis.summary}</p>

            <div className="flex items-center justify-between text-xs text-[#71717a]">
              <span>{analysis.author}</span>
              <span>{analysis.readTime} min czytania</span>
            </div>

            {analysis.isLocked ? (
              <Link
                href="/cennik"
                className="mt-4 block text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Odblokuj z Premium
              </Link>
            ) : (
              <button className="mt-4 w-full bg-[#2a2a3e] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#3a3a4e] transition-colors">
                Czytaj analizę →
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {!hasPremium && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-[#c9a962]/30 rounded-lg p-6 text-center">
          <h3 className="text-[#c9a962] font-semibold text-lg mb-2">Odblokuj wszystkie analizy</h3>
          <p className="text-[#a1a1aa] text-sm mb-4">
            Subskrypcja Pro daje dostęp do ekskluzywnych analiz od najlepszych ekspertów.
          </p>
          <Link
            href="/cennik"
            className="inline-block bg-[#c9a962] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#d4b86a] transition-colors"
          >
            Zobacz plany
          </Link>
        </div>
      )}
    </div>
  );
}

