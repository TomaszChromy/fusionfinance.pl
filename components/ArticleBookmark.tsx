"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  position: number;
  createdAt: string;
  note?: string;
}

interface ArticleBookmarkProps {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  className?: string;
}

export default function ArticleBookmark({
  articleId,
  articleTitle,
  articleUrl,
  className = "",
}: ArticleBookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    setIsBookmarked(bookmarks.some((b) => b.id === articleId));
  }, [articleId]);

  const toggleBookmark = () => {
    const bookmarks = getBookmarks();

    if (isBookmarked) {
      const filtered = bookmarks.filter((b) => b.id !== articleId);
      localStorage.setItem("article-bookmarks", JSON.stringify(filtered));
      setIsBookmarked(false);
    } else {
      const scrollPosition = window.scrollY;
      const newBookmark: Bookmark = {
        id: articleId,
        title: articleTitle,
        url: articleUrl,
        position: scrollPosition,
        createdAt: new Date().toISOString(),
      };
      bookmarks.push(newBookmark);
      localStorage.setItem("article-bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(true);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleBookmark}
        className={`p-2 rounded-lg transition-colors ${
          isBookmarked
            ? "bg-[#c9a962]/20 text-[#c9a962]"
            : "bg-white/5 text-[#71717a] hover:text-[#c9a962]"
        }`}
        title={isBookmarked ? "Usuń zakładkę" : "Dodaj zakładkę"}
      >
        <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-full mt-2 px-3 py-2 bg-[#0c0d10] border border-[#c9a962]/20 rounded-lg text-xs text-[#c9a962] whitespace-nowrap z-10"
          >
            Zakładka zapisana!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("article-bookmarks") || "[]");
  } catch {
    return [];
  }
}

// Bookmarks list component
export function BookmarksList({ className = "" }: { className?: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const removeBookmark = (id: string) => {
    const filtered = bookmarks.filter((b) => b.id !== id);
    localStorage.setItem("article-bookmarks", JSON.stringify(filtered));
    setBookmarks(filtered);
  };

  if (bookmarks.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-[#71717a] text-sm">Brak zapisanych zakładek</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {bookmarks.map((bookmark) => (
        <motion.div
          key={bookmark.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="flex items-center justify-between gap-4 p-4 bg-[#0c0d10] border border-white/5 rounded-xl hover:border-[#c9a962]/20 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <a href={bookmark.url} className="text-sm font-medium text-[#f4f4f5] hover:text-[#c9a962] transition-colors line-clamp-1">
              {bookmark.title}
            </a>
            <p className="text-xs text-[#52525b] mt-1">
              {new Date(bookmark.createdAt).toLocaleDateString("pl-PL")} • Pozycja: {Math.round(bookmark.position)}px
            </p>
          </div>
          <button
            onClick={() => removeBookmark(bookmark.id)}
            className="p-2 text-[#71717a] hover:text-[#f87171] transition-colors"
          >
            ✕
          </button>
        </motion.div>
      ))}
    </div>
  );
}

// Continue reading button
export function ContinueReading({ articleId, className = "" }: { articleId: string; className?: string }) {
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    const bookmarks = getBookmarks();
    const found = bookmarks.find((b) => b.id === articleId);
    if (found && found.position > 200) {
      setBookmark(found);
    }
  }, [articleId]);

  if (!bookmark) return null;

  const scrollToPosition = () => {
    window.scrollTo({ top: bookmark.position, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={scrollToPosition}
      className={`fixed bottom-20 right-4 px-4 py-2 bg-[#c9a962] text-[#08090c] text-sm font-medium rounded-lg shadow-lg hover:bg-[#d4b872] transition-colors z-40 ${className}`}
    >
      Kontynuuj czytanie ↓
    </motion.button>
  );
}

