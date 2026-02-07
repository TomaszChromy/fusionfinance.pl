"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface ArticleCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  category?: string;
  publishedAt: string;
  source?: string;
}

interface EditorialArticlesProps {
  limit?: number;
  className?: string;
  category?: string;
}

export default function EditorialArticles({ limit = 6, className = "", category }: EditorialArticlesProps) {
  const [articles, setArticles] = useState<ArticleCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const params = new URLSearchParams({ limit: String(limit) });
        if (category) params.set("category", category);
        const res = await fetch(`/api/articles?${params.toString()}`, { cache: "no-store" });
        const data = await res.json();
        if (isMounted && Array.isArray(data.items)) {
          setArticles(data.items);
        }
      } catch (error) {
        console.error("Editorial articles fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [category, limit]);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="h-44 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="text-center text-sm text-[#71717a] py-6">
        Brak artykułów redakcyjnych do wyświetlenia.
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {articles.map((article, index) => (
        <motion.article
          key={article.slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden hover:border-[#c9a962]/30 transition-all"
        >
          {article.coverImage && (
            <div className="relative h-36 overflow-hidden">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {article.category && (
                <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-black/60 text-white uppercase tracking-wide">
                  {article.category}
                </span>
              )}
            </div>
          )}
          <div className="p-4 flex flex-col gap-2">
            <Link href={`/artykuly/${article.slug}`}>
              <h3 className="text-sm font-semibold text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2">
                {article.title}
              </h3>
            </Link>
            <p className="text-xs text-[#a1a1aa] line-clamp-3">{article.summary}</p>
            <div className="flex items-center justify-between text-[10px] text-[#52525b]">
              <span>{new Date(article.publishedAt).toLocaleDateString("pl-PL")}</span>
              <span className="text-[#c9a962]">{article.source || "FusionFinance"}</span>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
