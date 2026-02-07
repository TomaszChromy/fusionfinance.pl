"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import TagList from "./TagList";

interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  category?: string;
  publishedAt: string;
  source?: string;
  author?: string;
  tags?: string[];
}

export default function TopStories({ limit = 4, className = "" }: { limit?: number; className?: string }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/articles?limit=${limit}`, { cache: "no-store" });
        const data = await res.json();
        if (mounted && Array.isArray(data.items)) {
          setStories(data.items);
        }
      } catch (error) {
        console.error("TopStories fetch error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [limit]);

  const skeleton = (
    <div className={`grid gap-4 lg:grid-cols-[1.618fr_1fr] ${className}`}>
      <div className="h-56 lg:h-72 bg-white/5 rounded-xl animate-pulse" />
      <div className="grid grid-rows-2 gap-4">
        <div className="h-full bg-white/5 rounded-xl animate-pulse" />
        <div className="h-full bg-white/5 rounded-xl animate-pulse" />
      </div>
    </div>
  );

  if (loading) return skeleton;
  if (!stories.length) return null;

  const [main, ...rest] = stories;

  return (
    <div className={`grid gap-4 lg:grid-cols-[1.618fr_1fr] ${className}`}>
      {/* Main story */}
      <Link href={`/artykuly/${main.slug}`} className="group">
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-56 lg:h-72 rounded-2xl overflow-hidden bg-[#0c0d10] border border-white/5"
        >
          {main.coverImage && (
            <Image
              src={main.coverImage}
              alt={main.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-600"
              sizes="(max-width: 1024px) 100vw, 70vw"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-[#c9a962] uppercase tracking-wide">
              <span>{main.category || "Analiza"}</span>
              <span className="w-1 h-1 rounded-full bg-[#c9a962]" />
              <span>{new Date(main.publishedAt).toLocaleDateString("pl-PL")}</span>
              {main.source && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[#c9a962]" />
                  <span>{main.source}</span>
                </>
              )}
            </div>
            <h3 className="text-xl lg:text-2xl font-serif text-white font-semibold leading-tight group-hover:text-[#c9a962] transition-colors">
              {main.title}
            </h3>
            <p className="text-sm text-white/80 line-clamp-2 lg:line-clamp-3">{main.summary}</p>
            {main.author && (
              <p className="text-[11px] text-white/70">Autor: {main.author}</p>
            )}
            <TagList tags={main.tags} />
          </div>
        </motion.article>
      </Link>

      {/* Secondary stories */}
      <div className="grid grid-rows-2 gap-4">
        {rest.slice(0, 2).map((story, idx) => (
          <Link href={`/artykuly/${story.slug}`} key={story.slug} className="group h-full">
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (idx + 1) }}
              className="relative h-full rounded-2xl overflow-hidden bg-[#0c0d10] border border-white/5"
            >
              {story.coverImage && (
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-600"
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end gap-2">
                <div className="flex items-center gap-2 text-[10px] text-[#c9a962] uppercase tracking-wide">
                  <span>{story.category || "Analiza"}</span>
                  <span className="w-1 h-1 rounded-full bg-[#c9a962]" />
                  <span>{new Date(story.publishedAt).toLocaleDateString("pl-PL")}</span>
                  {story.source && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[#c9a962]" />
                      <span>{story.source}</span>
                    </>
                  )}
                </div>
                <h4 className="text-sm lg:text-base font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#c9a962] transition-colors">
                  {story.title}
                </h4>
                {story.author && (
                  <p className="text-[10px] text-white/70">Autor: {story.author}</p>
                )}
                <TagList tags={story.tags} />
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </div>
  );
}
