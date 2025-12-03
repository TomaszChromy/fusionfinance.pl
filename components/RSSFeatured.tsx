"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
  // Przekaż oryginalny obraz lub fallback tematyczny
  const imageUrl = getImageForArticle(index, article.title, article.image);

  // Encode article data in URL params
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

export default function RSSFeatured() {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        // Use Next.js API in dev, PHP API in production
        const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? "/api/rss?feed=all&limit=6"
          : "/api/rss.php?feed=all&limit=6";
        const response = await fetch(apiUrl);
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
    <section className="pt-4 lg:pt-6">
      {/* Nagłówek sekcji */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
          <div>
            <h2 className="text-xl lg:text-2xl font-serif font-medium text-[#f4f4f5] tracking-tight">Wiadomości dnia</h2>
            <p className="text-xs text-[#71717a] mt-0.5">Najważniejsze informacje ze świata finansów</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-medium">
            {new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a962] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a962]"></span>
          </span>
        </div>
      </div>

      {/* Grid z artykułami */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

        {/* Główny artykuł - duży */}
        {articles[0] && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.005 }}
            className="lg:row-span-2"
          >
            <Link href={createArticleUrl(articles[0], 0)} className="group block bg-[#0c0d10] border border-white/5 rounded-2xl overflow-hidden hover:border-[#c9a962]/40 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(201,169,98,0.1)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getImageForArticle(0, articles[0].title, articles[0].image)}
                  alt={articles[0].title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#c9a962] to-[#e4d4a5] text-[#08090c] text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
                    <span className="w-1.5 h-1.5 bg-[#08090c] rounded-full animate-pulse" />
                    Wyróżnione
                  </span>
                  <h2 className="font-serif text-[22px] lg:text-[30px] font-medium text-white leading-tight group-hover:text-[#e4d4a5] transition-colors duration-300 drop-shadow-lg">
                    {articles[0].title}
                  </h2>
                </div>
              </div>
              <div className="p-6 lg:p-8 pt-5 bg-gradient-to-b from-[#0c0d10] to-[#0a0b0e]">
                <p className="text-[14px] lg:text-[15px] text-[#a1a1aa] leading-relaxed mb-4 line-clamp-2 group-hover:text-[#d4d4d8] transition-colors duration-200">
                  {articles[0].description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-[0.1em] font-medium">
                    {formatPolishDate(articles[0].date)}
                  </span>
                  <span className="text-[13px] text-[#c9a962] font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    Czytaj więcej
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        )}

        {/* Mniejsze artykuły - kolumna po prawej */}
        <div className="space-y-4">
          {articles.slice(1, 4).map((article, index) => (
            <motion.article
              key={article.link + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index + 1) * 0.1 }}
              whileHover={{ scale: 1.01, x: 3 }}
            >
              <Link href={createArticleUrl(article, index + 1)} className="group flex gap-5 bg-[#0c0d10] border border-white/5 rounded-xl p-4 hover:border-[#c9a962]/30 hover:bg-[#0c0d10]/80 transition-all duration-300 hover:shadow-[0_4px_30px_rgba(201,169,98,0.08)]">
                <div className="relative w-[110px] h-[85px] lg:w-[150px] lg:h-[110px] flex-shrink-0 overflow-hidden rounded-lg border border-white/10 group-hover:border-[#c9a962]/30 transition-all duration-300">
                  <Image
                    src={getImageForArticle(index + 1, article.title, article.image)}
                    alt={article.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
                    sizes="150px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                  <div>
                    <h3 className="font-serif text-[15px] lg:text-[17px] font-medium text-[#f4f4f5] leading-snug mb-2 group-hover:text-[#c9a962] transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[12px] text-[#71717a] line-clamp-2 hidden lg:block group-hover:text-[#a1a1aa] transition-colors duration-200">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-[#52525b] uppercase tracking-wide font-medium">
                      {formatPolishDate(article.date)}
                    </span>
                    <span className="text-[11px] text-[#c9a962] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 ml-auto">
                      Czytaj
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Więcej wiadomości - poziomy pasek */}
      {articles.length > 4 && (
        <div className="mt-[34px] pt-[21px] border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[21px]">
            {articles.slice(4, 7).map((article, index) => (
              <motion.div
                key={article.link + index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={createArticleUrl(article, index + 4)} className="group block p-[13px] bg-[#0c0d10]/50 border border-white/5 rounded-lg hover:border-[#c9a962]/20 transition-colors">
                  <h4 className="font-serif text-[14px] text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors duration-300 leading-snug line-clamp-2">
                    {article.title}
                  </h4>
                  <span className="text-[10px] text-[#52525b] mt-2 block">
                    {formatPolishDate(article.date)}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

