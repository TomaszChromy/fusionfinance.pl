"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import Image from "next/image";
import Link from "next/link";
import { NoSearchResults } from "@/components/EmptyState";
import { CardSkeleton } from "@/components/Skeleton";
import Badge from "@/components/Badge";
import { SourceAvatar } from "@/components/Avatar";
import SearchSuggestions from "@/components/SearchSuggestions";
import PageHero from "@/components/PageHero";

interface SearchResult {
  title: string;
  link: string;
  description: string;
  content: string;
  date: string;
  source: string;
  image?: string;
}

const themeImages: Record<string, string> = {
  crypto: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
  forex: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80",
  stocks: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
  default: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
};

function getImageForArticle(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("bitcoin") || lower.includes("crypto") || lower.includes("eth")) return themeImages.crypto;
  if (lower.includes("walut") || lower.includes("dolar") || lower.includes("euro")) return themeImages.forex;
  if (lower.includes("gpw") || lower.includes("wig") || lower.includes("akcj")) return themeImages.stocks;
  return themeImages.default;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours} godz. temu`;
    return date.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateString;
  }
}

// Category keywords for filtering
const categoryKeywords: Record<string, string[]> = {
  rynki: ["rynek", "gospodark", "ekonomi", "pkb", "inflacj"],
  gielda: ["gpw", "wig", "akcj", "giełd", "notowania", "indeks"],
  crypto: ["bitcoin", "btc", "ethereum", "eth", "krypto", "crypto", "blockchain"],
  waluty: ["walut", "dolar", "euro", "kurs", "forex", "nbp", "złot"],
  analizy: ["analiz", "prognoz", "raport", "rekomendacj", "perspektyw"],
};

function matchesCategory(item: SearchResult, category: string): boolean {
  if (category === "all") return true;
  const keywords = categoryKeywords[category] || [];
  const text = `${item.title} ${item.description}`.toLowerCase();
  return keywords.some(kw => text.includes(kw));
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("cat") || "all";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<"date" | "relevance">("date");

  // Fetch results
  useEffect(() => {
    async function search() {
      setLoading(true);
      try {
        const feedParam = category === "all" ? "all" : category;
        const { getRssApiUrl } = await import("@/lib/api");
        const apiUrl = getRssApiUrl(feedParam, 100);

        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          let items = data.items || [];

          // Filter by query if provided
          if (query) {
            items = items.filter((item: SearchResult) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description?.toLowerCase().includes(query.toLowerCase())
            );
          }

          setResults(items);
        }
      } catch (error) {
        console.error("Search error:", error);
      }
      setLoading(false);
    }

    search();
  }, [query, category]);

  // Filter and sort results
  useEffect(() => {
    let filtered = results.filter(item => matchesCategory(item, category));

    // Sort
    if (sortBy === "date") {
      filtered = [...filtered].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    setFilteredResults(filtered);
  }, [results, category, sortBy]);

  // Update URL when category changes
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (newCategory !== "all") params.set("cat", newCategory);
    router.push(`/szukaj?${params.toString()}`);
  };

  return (
    <>
      {/* Search Header */}
      <div className="mb-6">
        <SearchBar />
        {/* Quick Suggestions */}
        <div className="mt-4">
          <SearchSuggestions placeholder="Szybkie wyszukiwanie aktywów..." className="max-w-md" />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category Filter */}
        <CategoryFilter selected={category} onChange={handleCategoryChange} />

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#71717a]">Sortuj:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSortBy("date")}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                sortBy === "date"
                  ? "bg-[#c9a962]/20 text-[#c9a962] border border-[#c9a962]/30"
                  : "text-[#71717a] hover:text-[#f4f4f5] border border-transparent"
              }`}
            >
              Od najnowszych
            </button>
            <button
              type="button"
              onClick={() => setSortBy("relevance")}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                sortBy === "relevance"
                  ? "bg-[#c9a962]/20 text-[#c9a962] border border-[#c9a962]/30"
                  : "text-[#71717a] hover:text-[#f4f4f5] border border-transparent"
              }`}
            >
              Trafność
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} showImage showAvatar />
          ))}
        </div>
      ) : filteredResults.length === 0 ? (
        <NoSearchResults
          query={query}
          onClear={() => router.push("/szukaj")}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-[#71717a] mb-6">
            Znaleziono <span className="text-[#c9a962] font-medium">{filteredResults.length}</span> wyników
            {query && <> dla &ldquo;{query}&rdquo;</>}
            {category !== "all" && <> w kategorii <span className="text-[#c9a962]">{category}</span></>}
          </p>
          {filteredResults.map((result, index) => {
            const imageUrl = result.image || getImageForArticle(result.title);
            const params = new URLSearchParams({
              title: result.title,
              desc: result.description || "",
              content: result.content || result.description || "",
              date: result.date,
              source: result.link,
              image: imageUrl,
            });
            
            // Check if article is new (within 24h)
            const isNew = new Date().getTime() - new Date(result.date).getTime() < 86400000;

            return (
              <motion.article
                key={result.link + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/artykul/?${params.toString()}`}
                  className="flex gap-5 p-4 bg-[#0c0d10] border border-white/5 rounded-xl hover:border-[#c9a962]/30 transition-all group"
                >
                  <div className="relative w-[180px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg">
                    <Image src={imageUrl} alt={result.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="180px" unoptimized />
                    {isNew && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="primary" size="sm">Nowe</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-serif text-lg font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2 mb-2">
                      {result.title}
                    </h3>
                    <p className="text-sm text-[#a1a1aa] line-clamp-2 mb-3">{result.description}</p>
                    <div className="flex items-center gap-3">
                      <SourceAvatar source={result.source || "news"} size="xs" />
                      <span className="text-xs text-[#71717a]">{formatDate(result.date)}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <div className="mx-auto max-w-[1000px] px-4 lg:px-6 py-8 lg:py-12">
        <PageHero
          title="Wyszukiwarka"
          subtitle="Przeszukaj wszystkie artykuły finansowe z Money, Bankier, S24, IndependentTrader, eGospodarka, Obserwator."
          eyebrow="Narzędzia"
          badge="Agregator PL"
        />
        <Suspense fallback={<div className="animate-pulse h-96 bg-white/5 rounded-xl" />}>
          <SearchContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
