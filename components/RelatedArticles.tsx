"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  content: string;
  date: string;
  source: string;
  image?: string;
}

interface RelatedArticlesProps {
  currentTitle: string;
  currentKeywords?: string[];
  maxArticles?: number;
  feedType?: string;
}

// Theme-based fallback images
const themeImages: Record<string, string> = {
  crypto: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80",
  forex: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&q=80",
  stocks: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&q=80",
  default: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
};

function detectTheme(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("bitcoin") || lowerTitle.includes("crypto") || lowerTitle.includes("ethereum")) return "crypto";
  if (lowerTitle.includes("eur/") || lowerTitle.includes("usd/") || lowerTitle.includes("forex")) return "forex";
  if (lowerTitle.includes("gpw") || lowerTitle.includes("wig") || lowerTitle.includes("giełd")) return "stocks";
  return "default";
}

function getImageUrl(article: RSSItem): string {
  if (article.image && article.image.startsWith("http")) return article.image;
  return themeImages[detectTheme(article.title)];
}

function extractKeywords(text: string): string[] {
  const stopWords = ["i", "w", "na", "do", "z", "o", "po", "za", "się", "to", "jak", "co", "ale", "czy", "tak", "nie"];
  return text.toLowerCase()
    .replace(/[^a-ząćęłńóśźż\s]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 10);
}

function calculateRelevance(article: RSSItem, currentKeywords: string[]): number {
  const articleKeywords = extractKeywords(article.title + " " + article.description);
  const matches = articleKeywords.filter(kw => currentKeywords.includes(kw)).length;
  return matches;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

function createArticleUrl(article: RSSItem): string {
  const params = new URLSearchParams({
    title: article.title,
    desc: article.description,
    content: article.content || article.description,
    date: article.date,
    source: article.link,
    image: getImageUrl(article),
  });
  return `/artykul/?${params.toString()}`;
}

export default function RelatedArticles({
  currentTitle,
  currentKeywords = [],
  maxArticles = 4,
  feedType = "bankier"
}: RelatedArticlesProps) {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);

  const keywords = useMemo(() => {
    return currentKeywords.length > 0 ? currentKeywords : extractKeywords(currentTitle);
  }, [currentTitle, currentKeywords]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const apiUrl = typeof window !== "undefined" && window.location.hostname === "localhost"
          ? `/api/rss?feed=${feedType}&limit=50`
          : `/api/rss.php?feed=${feedType}&limit=50`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setArticles(data.items || []);
      } catch {
        setArticles([]);
      }
      setLoading(false);
    }
    fetchArticles();
  }, [feedType]);

  const relatedArticles = useMemo(() => {
    return articles
      .filter(article => article.title !== currentTitle)
      .map(article => ({ ...article, relevance: calculateRelevance(article, keywords) }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxArticles);
  }, [articles, currentTitle, keywords, maxArticles]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(maxArticles)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-white/5 rounded-xl mb-3" />
            <div className="h-4 bg-white/5 rounded w-full mb-2" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (relatedArticles.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-[#c9a962]/20">
      <h3 className="font-serif text-xl text-[#f4f4f5] mb-6 flex items-center gap-3">
        <span className="w-1 h-6 bg-[#c9a962]" />
        Powiązane artykuły
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedArticles.map((article, index) => (
          <motion.article
            key={article.link}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link href={createArticleUrl(article)} className="block">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-white/10 group-hover:border-[#c9a962]/30 transition-colors">
                <Image src={getImageUrl(article)} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 1024px) 50vw, 25vw" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <h4 className="text-[13px] font-medium text-[#f4f4f5] leading-snug line-clamp-2 group-hover:text-[#c9a962] transition-colors">
                {article.title}
              </h4>
              <span className="text-[10px] text-[#71717a] mt-1 block">
                {formatDate(article.date)}
              </span>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

