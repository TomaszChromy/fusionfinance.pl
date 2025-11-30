"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  date: string;
  source: string;
  category?: string;
  image?: string;
}

// HD obrazy kategoryzowane tematycznie
const themeImages: Record<string, string[]> = {
  crypto: [
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=90",
    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200&q=90",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=90",
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=90",
    "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=90",
  ],
  forex: [
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1200&q=90",
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=90",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=90",
    "https://images.unsplash.com/photo-1621981386829-9b458a2cddde?w=1200&q=90",
  ],
  stocks: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=90",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=90",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&q=90",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90",
  ],
  economy: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=90",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=90",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=90",
  ],
  gold: [
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=90",
    "https://images.unsplash.com/photo-1624365168968-f283d506c6b6?w=1200&q=90",
    "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=1200&q=90",
  ],
  oil: [
    "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1200&q=90",
    "https://images.unsplash.com/photo-1545259741-2266a6f4d0f6?w=1200&q=90",
  ],
  bank: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=90",
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=1200&q=90",
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=90",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=90",
  ],
  default: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=90",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=90",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=90",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90",
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

    if (diffMins < 60) {
      return `${diffMins} min temu`;
    } else if (diffHours < 24) {
      return `${diffHours} godz. temu`;
    } else {
      return date.toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
    }
  } catch {
    return "";
  }
}

function createArticleUrl(article: RSSItem, index: number): string {
  // Create slug from title
  const slug = article.title
    .toLowerCase()
    .replace(/[ąàáâãäå]/g, 'a')
    .replace(/[ćčç]/g, 'c')
    .replace(/[ęèéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[łľ]/g, 'l')
    .replace(/[ńñ]/g, 'n')
    .replace(/[óòôõö]/g, 'o')
    .replace(/[śš]/g, 's')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[źżž]/g, 'z')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);

  // Przekaż oryginalny obraz lub fallback tematyczny
  const imageUrl = getImageForArticle(index, article.title, article.image);

  // Encode article data in URL params
  const params = new URLSearchParams({
    title: article.title,
    desc: article.description,
    date: article.date,
    source: article.link,
    image: imageUrl,
  });

  return `/artykul/?${params.toString()}`;
}

export default function RSSFeatured() {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch("/api/rss.php?feed=bankier&limit=3");
        if (response.ok) {
          const data = await response.json();
          setArticles(data.items || []);
        }
      } catch (e) {
        console.error("Failed to load articles", e);
      }
      setLoading(false);
    }
    loadArticles();
  }, []);

  if (loading) {
    return (
      <section className="mt-[55px]">
        <div className="flex items-center gap-3 mb-[21px]">
          <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
          <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Najnowsze wiadomości</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[21px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-[144px] bg-white/5 rounded-lg mb-[13px]" />
              <div className="h-[13px] bg-white/5 rounded w-3/4 mb-[8px]" />
              <div className="h-[8px] bg-white/5 rounded w-full mb-[8px]" />
              <div className="h-[8px] bg-white/5 rounded w-1/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-[55px] pt-[34px] border-t border-[#c9a962]/20">
      {/* Golden ratio grid: 61.8% / 38.2% */}
      <div className="grid grid-cols-1 lg:grid-cols-[61.8fr_38.2fr] gap-0">

        {/* Main featured article - Left column */}
        {articles[0] && (
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="lg:pr-[34px] lg:border-r border-white/5 pb-[21px] lg:pb-0"
          >
            <Link href={createArticleUrl(articles[0], 0)} className="group block">
              <div className="relative aspect-[16/10] mb-[21px] overflow-hidden rounded-lg">
                <Image
                  src={getImageForArticle(0, articles[0].title, articles[0].image)}
                  alt={articles[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 61.8vw"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h2 className="font-serif text-[28px] lg:text-[34px] font-medium text-[#f4f4f5] leading-tight mb-[13px] group-hover:text-[#c9a962] transition-colors duration-300">
                {articles[0].title}
              </h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed mb-[13px] line-clamp-3">
                {articles[0].description}
              </p>
              <span className="text-[11px] text-[#71717a] uppercase tracking-[0.1em]">
                {formatPolishDate(articles[0].date)}
              </span>
            </Link>
          </motion.article>
        )}

        {/* Sidebar articles - Right column */}
        <div className="lg:pl-[34px] space-y-0 divide-y divide-white/5">
          {articles.slice(1, 4).map((article, index) => (
            <motion.article
              key={article.link + index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: (index + 1) * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="py-[21px] first:pt-0 lg:first:pt-[21px]"
            >
              <Link href={createArticleUrl(article, index + 1)} className="group flex gap-[21px]">
                <div className="flex-1">
                  <h3 className="font-serif text-[17px] font-medium text-[#f4f4f5] leading-snug mb-[8px] group-hover:text-[#c9a962] transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-[13px] text-[#a1a1aa] line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <div className="relative w-[89px] h-[89px] flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={getImageForArticle(index + 1, article.title, article.image)}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="89px"
                    unoptimized
                  />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      {/* More headlines section */}
      {articles.length > 4 && (
        <div className="mt-[34px] pt-[34px] border-t border-white/5">
          <div className="flex items-center gap-3 mb-[21px]">
            <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
            <h3 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Więcej wiadomości</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-[13px]">
            {articles.slice(4, 10).map((article, index) => (
              <motion.div
                key={article.link + index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="py-[8px] border-b border-white/5 last:border-b-0"
              >
                <Link href={createArticleUrl(article, index + 4)} className="group block">
                  <h4 className="font-serif text-[15px] text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors duration-300 leading-snug">
                    {article.title}
                  </h4>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Section link */}
      <div className="mt-[34px] pt-[21px] border-t border-white/5">
        <Link href="/analizy" className="inline-flex items-center gap-[8px] text-[12px] font-medium text-[#c9a962] uppercase tracking-[0.15em] hover:text-[#e4d4a5] transition-colors duration-300 group">
          Zobacz wszystkie artykuły
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </div>
    </section>
  );
}

