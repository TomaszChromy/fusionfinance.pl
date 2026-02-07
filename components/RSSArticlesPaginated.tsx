"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Pagination from "./Pagination";
import FavoriteButton from "./FavoriteButton";
import { ListSkeleton } from "./Skeleton";
import { ErrorState } from "./EmptyState";
import { SourceAvatar } from "./Avatar";

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

interface RSSArticlesPaginatedProps {
  feedType?: string;
  totalArticles?: number;
  articlesPerPage?: number;
  showImage?: boolean;
}

// Obrazy kategoryzowane tematycznie
const themeImages: Record<string, string[]> = {
  crypto: [
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80", // Bitcoin gold
    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80", // Crypto coins
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80", // Ethereum
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80", // Crypto trading
    "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80", // Bitcoin chart
    "https://images.unsplash.com/photo-1629339942248-45d4b10c8c2f?w=800&q=80", // Blockchain
  ],
  forex: [
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80", // Currency exchange
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80", // Dollar bills
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80", // Trading charts
    "https://images.unsplash.com/photo-1621981386829-9b458a2cddde?w=800&q=80", // Euro money
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80", // Money stack
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80", // Global currency
  ],
  stocks: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80", // Stock market
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80", // Trading screen
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80", // Stock exchange
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", // Finance data
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", // Analytics
    "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&q=80", // Bull market
  ],
  economy: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", // Business meeting
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80", // Economy growth
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", // Skyscrapers
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80", // Global economy
    "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80", // Statistics
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80", // Business
  ],
  gold: [
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80", // Gold bars
    "https://images.unsplash.com/photo-1624365168968-f283d506c6b6?w=800&q=80", // Gold coins
    "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&q=80", // Gold investment
    "https://images.unsplash.com/photo-1589787168422-cdbb51f6a4e3?w=800&q=80", // Precious metals
  ],
  oil: [
    "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80", // Oil pump
    "https://images.unsplash.com/photo-1545259741-2266a6f4d0f6?w=800&q=80", // Oil rig
    "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=800&q=80", // Barrel
    "https://images.unsplash.com/photo-1582560469781-1423bb6e2663?w=800&q=80", // Refinery
  ],
  bank: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", // Bank building
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80", // Banking
    "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80", // Credit card
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80", // Finance
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", // Technology
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", // Tech team
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80", // Coding
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80", // Computer
  ],
  default: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  ],
};

// Słowa kluczowe dla wykrywania tematu
const themeKeywords: Record<string, string[]> = {
  crypto: ["bitcoin", "btc", "ethereum", "eth", "crypto", "kryptowalut", "blockchain", "token", "nft", "defi", "altcoin", "binance", "coinbase", "stablecoin", "usdt", "usdc", "solana", "cardano", "ripple", "xrp", "dogecoin", "shiba"],
  forex: ["eur/", "usd/", "gbp/", "jpy/", "chf/", "pln", "walut", "forex", "kurs", "dolar", "euro", "funt", "frank", "jen", "złot", "wymian", "kantor"],
  stocks: ["gpw", "wig", "giełd", "akcj", "spółk", "indeks", "notowani", "s&p", "nasdaq", "dow jones", "nyse", "etf", "dywidend", "ipo", "emisj"],
  economy: ["gospodar", "ekonom", "pkb", "inflacj", "bezrobo", "budżet", "podatk", "stopy procent", "nbp", "fed", "ecb", "recesj", "wzrost", "kryzys"],
  gold: ["złot", "gold", "srebr", "silver", "metal", "platyn", "pallad"],
  oil: ["ropa", "nafta", "oil", "brent", "wti", "opec", "gaz", "energy", "paliw"],
  bank: ["bank", "kredyt", "pożyczk", "depozyt", "lokata", "hipote", "rata", "oprocentowan"],
  tech: ["technolog", "ai", "sztuczn", "intel", "nvidia", "apple", "microsoft", "google", "amazon", "meta", "tesla", "startu"],
};

function detectTheme(title: string): string {
  const lowerTitle = title.toLowerCase();

  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) {
        return theme;
      }
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

    if (diffMins < 60) return `${diffMins} min temu`;
    else if (diffHours < 24) return `${diffHours} godz. temu`;
    else if (diffDays < 7) return `${diffDays} dni temu`;
    else return date.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
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

export default function RSSArticlesPaginated({
  feedType = "bankier",
  totalArticles = 64,
  articlesPerPage = 8,
  showImage = true
}: RSSArticlesPaginatedProps) {
  const [allArticles, setAllArticles] = useState<RSSItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        // Use Next.js API on port 3000, PHP API on static export
        const { getRssApiUrl } = await import("@/lib/api");
        const apiUrl = getRssApiUrl(feedType, totalArticles);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setAllArticles(data.items || []);
        setError(null);
      } catch {
        setError("Nie udało się załadować artykułów");
      }
      setLoading(false);
    }
    loadArticles();
  }, [feedType, totalArticles]);

  const totalPages = Math.ceil(allArticles.length / articlesPerPage);

  const currentArticles = useMemo(() => {
    const start = (currentPage - 1) * articlesPerPage;
    return allArticles.slice(start, start + articlesPerPage);
  }, [allArticles, currentPage, articlesPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to container top
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return <ListSkeleton items={articlesPerPage} showAvatar />;
  }

  if (error) {
    return (
      <ErrorState onRetry={() => window.location.reload()} />
    );
  }

  if (allArticles.length === 0) {
    return (
      <div className="text-center py-[34px] text-[#71717a]">
        <p>Brak artykułów do wyświetlenia</p>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {/* Info o paginacji */}
      <div className="flex justify-between items-center mb-[21px] pb-[13px] border-b border-[#c9a962]/20">
        <span className="text-[12px] text-[#c9a962] uppercase tracking-[0.1em] font-medium">
          Strona {currentPage} z {totalPages}
        </span>
        <span className="text-[12px] text-[#71717a]">
          Łącznie: {allArticles.length} artykułów
        </span>
      </div>

      {/* Lista artykułów */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {currentArticles.map((article, index) => {
            const imageUrl = getImageForArticle(index + (currentPage - 1) * articlesPerPage, article.title, article.image);
            return (
              <motion.article
                key={article.link + index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.01 }}
                className="group bg-[#0c0d10] border border-white/5 rounded-2xl overflow-hidden hover:border-[#c9a962]/30 hover:shadow-[0_12px_40px_rgba(201,169,98,0.08)] transition-all duration-300 flex flex-col"
              >
                <Link href={createArticleUrl(article, index + (currentPage - 1) * articlesPerPage)} className="flex flex-col h-full">
                  {showImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-black/60 text-[10px] uppercase tracking-[0.1em] text-white">
                          {article.source || "news"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-[#c9a962]/90 text-[10px] uppercase tracking-[0.1em] text-[#08090c]">
                          {formatPolishDate(article.date)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#a1a1aa] uppercase tracking-[0.1em]">
                      <SourceAvatar source={article.source || "news"} size="xs" />
                      <span>{formatPolishDate(article.date)}</span>
                    </div>
                    <h3 className="font-serif text-[17px] lg:text-[19px] font-semibold text-[#f4f4f5] leading-snug group-hover:text-[#c9a962] transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[14px] text-[#a1a1aa] leading-relaxed line-clamp-3 group-hover:text-[#d4d4d8] transition-colors duration-200">
                      {article.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[12px] text-[#c9a962] font-medium flex items-center gap-1">
                        Czytaj więcej
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
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
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
