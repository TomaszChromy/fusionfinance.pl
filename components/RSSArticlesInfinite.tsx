"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  content: string;
  date: string;
  source: string;
  category?: string;
  image?: string;
}

interface RSSArticlesInfiniteProps {
  feedType?: string;
  articlesPerLoad?: number;
  showImage?: boolean;
}

// Theme images mapping (simplified)
const themeImages: Record<string, string[]> = {
  crypto: ["https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80"],
  forex: ["https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80"],
  stocks: ["https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80"],
  default: ["https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"],
};

const themeKeywords: Record<string, string[]> = {
  crypto: ["bitcoin", "btc", "ethereum", "eth", "crypto", "kryptowalut"],
  forex: ["eur/", "usd/", "forex", "walut", "kurs"],
  stocks: ["gpw", "wig", "giełd", "akcj"],
};

function detectTheme(title: string): string {
  const lowerTitle = title.toLowerCase();
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) return theme;
    }
  }
  return "default";
}

function getFallbackImage(index: number, title: string): string {
  const theme = detectTheme(title);
  const images = themeImages[theme] || themeImages.default;
  return images[index % images.length];
}

function getImageForArticle(index: number, title: string, originalImage?: string): string {
  if (originalImage && originalImage.startsWith("http")) return originalImage;
  return getFallbackImage(index, title);
}

function formatPolishDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min temu`;
    else if (diffHours < 24) return `${diffHours} godz. temu`;
    else if (diffDays < 7) return `${diffDays} dni temu`;
    else return date.toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
  } catch {
    return dateString;
  }
}

function createArticleUrl(article: RSSItem, index: number): string {
  const imageUrl = getImageForArticle(index, article.title, article.image);
  const params = new URLSearchParams({
    title: article.title,
    desc: article.description,
    content: article.content || article.description,
    date: article.date,
    source: article.link,
    image: imageUrl,
  });
  return `/artykul/?${params.toString()}`;
}

export default function RSSArticlesInfinite({
  feedType = "bankier",
  articlesPerLoad = 10,
  showImage = true
}: RSSArticlesInfiniteProps) {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [displayedCount, setDisplayedCount] = useState(articlesPerLoad);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Fetch all articles on mount
  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? `/api/rss?feed=${feedType}&limit=100`
          : `/api/rss.php?feed=${feedType}&limit=100`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setArticles(data.items || []);
        setError(null);
      } catch {
        setError("Nie udało się załadować artykułów");
      }
      setLoading(false);
    }
    loadArticles();
  }, [feedType]);

  // Load more articles
  const loadMore = useCallback(() => {
    if (displayedCount >= articles.length || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + articlesPerLoad, articles.length));
      setLoadingMore(false);
    }, 300);
  }, [displayedCount, articles.length, loadingMore, articlesPerLoad]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  const displayedArticles = articles.slice(0, displayedCount);
  const hasMore = displayedCount < articles.length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(articlesPerLoad)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-5 p-4 rounded-xl bg-white/[0.02]">
            {showImage && <div className="w-[120px] h-[90px] lg:w-[180px] lg:h-[120px] bg-white/5 rounded-xl" />}
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
              <div className="h-3 bg-white/5 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-[#71717a]">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#c9a962]/20">
        <span className="text-[12px] text-[#c9a962] uppercase tracking-[0.1em] font-medium">
          Infinite Scroll
        </span>
        <span className="text-[12px] text-[#71717a]">
          {displayedCount} z {articles.length}
        </span>
      </div>

      {/* Articles */}
      <AnimatePresence>
        <div className="space-y-4">
          {displayedArticles.map((article, index) => {
            const imageUrl = getImageForArticle(index, article.title, article.image);
            return (
              <motion.article
                key={article.link + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index < articlesPerLoad ? index * 0.05 : 0 }}
                whileHover={{ scale: 1.005, x: 4 }}
                className="group"
              >
                <Link
                  href={createArticleUrl(article, index)}
                  className="flex gap-5 p-4 -mx-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/[0.03] border border-transparent hover:border-[#c9a962]/20"
                >
                  {showImage && (
                    <div className="relative w-[120px] h-[90px] lg:w-[180px] lg:h-[120px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 group-hover:border-[#c9a962]/30 transition-all duration-300">
                      <Image
                        src={imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 1024px) 120px, 180px"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-serif text-[16px] lg:text-[18px] font-medium text-[#f4f4f5] leading-snug mb-2 group-hover:text-[#c9a962] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-[13px] text-[#a1a1aa] leading-relaxed line-clamp-2">
                        {article.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] text-[#71717a] uppercase tracking-[0.08em]">
                        {formatPolishDate(article.date)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#c9a962]/40" />
                      <span className="text-[12px] text-[#c9a962] opacity-0 group-hover:opacity-100 transition-opacity">
                        Czytaj więcej →
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <FavoriteButton
                      article={{
                        title: article.title,
                        description: article.description,
                        image: imageUrl,
                        source: article.source,
                        date: formatPolishDate(article.date),
                      }}
                      size="sm"
                    />
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#c9a962] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-[#c9a962] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-[#c9a962] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && !loadingMore && (
        <div ref={observerRef} className="h-20 flex items-center justify-center">
          <span className="text-[12px] text-[#71717a]">Przewiń aby załadować więcej...</span>
        </div>
      )}

      {/* End of list */}
      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8 border-t border-[#c9a962]/20 mt-6">
          <p className="text-[13px] text-[#71717a]">
            To już wszystkie artykuły ({articles.length})
          </p>
        </div>
      )}
    </div>
  );
}
