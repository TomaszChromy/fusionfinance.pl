"use client";

import { useEffect, useState } from "react";
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
  category?: string;
  image?: string;
}

interface RSSArticlesProps {
  feedType?: string;
  limit?: number;
  showImage?: boolean;
}

// Obrazy kategoryzowane tematycznie
const themeImages: Record<string, string[]> = {
  crypto: [
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
    "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
  ],
  forex: [
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80",
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1621981386829-9b458a2cddde?w=800&q=80",
  ],
  stocks: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  ],
  economy: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ],
  gold: [
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
    "https://images.unsplash.com/photo-1624365168968-f283d506c6b6?w=800&q=80",
    "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&q=80",
  ],
  oil: [
    "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80",
    "https://images.unsplash.com/photo-1545259741-2266a6f4d0f6?w=800&q=80",
  ],
  bank: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80",
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  ],
};

const themeKeywords: Record<string, string[]> = {
  crypto: ["bitcoin", "btc", "ethereum", "eth", "crypto", "kryptowalut", "blockchain", "token", "nft", "defi", "altcoin", "binance", "stablecoin", "solana", "cardano", "ripple", "xrp", "dogecoin"],
  forex: ["eur/", "usd/", "gbp/", "jpy/", "chf/", "pln", "walut", "forex", "kurs", "dolar", "euro", "funt", "frank", "jen", "złot"],
  stocks: ["gpw", "wig", "giełd", "akcj", "spółk", "indeks", "notowani", "s&p", "nasdaq", "dow jones", "etf", "dywidend"],
  economy: ["gospodar", "ekonom", "pkb", "inflacj", "bezrobo", "budżet", "podatk", "stopy procent", "nbp", "fed", "ecb", "recesj"],
  gold: ["złot", "gold", "srebr", "silver", "metal", "platyn"],
  oil: ["ropa", "nafta", "oil", "brent", "wti", "opec", "gaz", "paliw"],
  bank: ["bank", "kredyt", "pożyczk", "depozyt", "lokata", "hipote"],
  tech: ["technolog", "ai", "sztuczn", "intel", "nvidia", "apple", "microsoft", "google", "amazon", "tesla"],
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
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[(hash + index) % images.length];
}

function getImageForArticle(index: number, title: string, originalImage?: string): string {
  // Preferuj oryginalny obraz z RSS, fallback do tematycznego
  if (originalImage && originalImage.startsWith("http")) {
    return originalImage;
  }
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

    if (diffMins < 60) {
      return `${diffMins} min temu`;
    } else if (diffHours < 24) {
      return `${diffHours} godz. temu`;
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`;
    } else {
      return date.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  } catch {
    return dateString;
  }
}

function createArticleUrl(article: RSSItem, index: number): string {
  // Przekaż oryginalny obraz lub fallback tematyczny
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

export default function RSSArticles({ feedType = "bankier", limit = 10, showImage = true }: RSSArticlesProps) {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        // Use Next.js API on port 3000, PHP API on static export
        const { getRssApiUrl } = await import("@/lib/api");
        const apiUrl = getRssApiUrl(feedType, limit);
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
  }, [feedType, limit]);

  if (loading) {
    return (
      <div className="space-y-[21px]">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-[21px]">
            {showImage && <div className="w-[89px] h-[55px] bg-white/5 rounded-lg" />}
            <div className="flex-1 space-y-[8px]">
              <div className="h-[13px] bg-white/5 rounded w-3/4" />
              <div className="h-[8px] bg-white/5 rounded w-1/2" />
              <div className="h-[8px] bg-white/5 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-[34px] text-[#71717a]">
        <p>{error}</p>
        <p className="text-[12px] mt-[8px]">Sprawdź połączenie internetowe</p>
      </div>
    );
  }

  // Luxury article list
  return (
    <div className="divide-y divide-white/5">
      {articles.map((article, index) => {
        const imageUrl = getImageForArticle(index, article.title, article.image);

        return (
          <motion.article
            key={article.link + index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
            className="py-[21px] first:pt-0"
          >
            <Link
              href={createArticleUrl(article, index)}
              className="group flex gap-[21px]"
            >
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-[17px] lg:text-[19px] font-medium text-[#f4f4f5] leading-tight mb-[8px] group-hover:text-[#c9a962] transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-[13px] text-[#a1a1aa] leading-relaxed mb-[13px] line-clamp-2 lg:line-clamp-3">
                  {article.description}
                </p>
                <span className="text-[11px] text-[#71717a] uppercase tracking-[0.1em]">
                  {formatPolishDate(article.date)}
                </span>
              </div>

              {/* Image - Luxury thumbnail */}
              {showImage && (
                <div className="relative w-[89px] h-[89px] lg:w-[144px] lg:h-[89px] flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 89px, 144px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}

