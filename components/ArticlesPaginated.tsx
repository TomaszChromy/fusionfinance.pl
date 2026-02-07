"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "./Pagination";
import { ListSkeleton } from "./Skeleton";
import { ErrorState } from "./EmptyState";
import TagList from "./TagList";

type ArticleItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  source?: string;
  publishedAt: string;
  author?: string;
};

interface ArticlesPaginatedProps {
  category?: string;
  tag?: string;
  search?: string;
  articlesPerPage?: number;
}

export default function ArticlesPaginated({
  category,
  tag,
  search,
  articlesPerPage = 9,
}: ArticlesPaginatedProps) {
  const [items, setItems] = useState<ArticleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: String(articlesPerPage),
          page: String(page),
        });
        if (category) params.set("category", category);
        if (tag) params.set("tag", tag);
        if (search) params.set("search", search);

        const res = await fetch(`/api/articles?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Błąd pobierania artykułów");
        const data = await res.json();
        if (!mounted) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Nie udało się załadować artykułów");
        setItems([]);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [articlesPerPage, category, page, search, tag]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / articlesPerPage)), [total, articlesPerPage]);

  if (loading) return <ListSkeleton items={articlesPerPage} showAvatar />;
  if (error) return <ErrorState title="Nie udało się pobrać artykułów" description={error} />;
  if (!items.length) return <ErrorState title="Brak artykułów" description="Dodamy je, gdy tylko będą dostępne." />;

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnimatePresence>
          {items.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.03 }}
              className="group bg-[#0c0d10] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 flex flex-col"
            >
              {article.coverImage && (
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] uppercase tracking-wide">
                    {article.category && (
                      <span className="px-2 py-1 rounded-full bg-black/60 text-white">{article.category}</span>
                    )}
                    <span className="px-2 py-1 rounded-full bg-black/60 text-[#c9a962]">
                      {new Date(article.publishedAt).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 flex flex-col gap-3 flex-1">
                <Link href={`/artykuly/${article.slug}`}>
                  <h3 className="text-lg font-serif font-semibold text-white leading-tight group-hover:text-[#c9a962] transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-sm text-[#a1a1aa] leading-relaxed line-clamp-3">{article.summary}</p>
                <TagList tags={article.tags} />
                <div className="flex items-center justify-between text-[11px] text-[#71717a] pt-2 border-t border-white/5">
                  <span>{article.source || "FusionFinance"}</span>
                  {article.author && <span>Autor: {article.author}</span>}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p);
          if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
      />
    </div>
  );
}
