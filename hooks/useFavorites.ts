"use client";

import { useState, useEffect, useCallback } from "react";

export interface FavoriteArticle {
  id: string;
  title: string;
  description?: string;
  image?: string;
  source?: string;
  date?: string;
  url?: string;
  savedAt: number;
}

const STORAGE_KEY = "fusionfinance_favorites";
const MAX_FAVORITES = 50;

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteArticle[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as FavoriteArticle[];
      }
    } catch {
      console.error("Failed to load favorites");
    }
    return [];
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      console.error("Failed to save favorites");
    }
  }, [favorites]);

  const addFavorite = useCallback((article: Omit<FavoriteArticle, "savedAt">) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(f => f.id === article.id)) {
        return prev;
      }
      // Add new favorite at the beginning, limit to MAX_FAVORITES
      const newFavorites = [{ ...article, savedAt: Date.now() }, ...prev];
      return newFavorites.slice(0, MAX_FAVORITES);
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, []);

  const toggleFavorite = useCallback((article: Omit<FavoriteArticle, "savedAt">) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === article.id);
      if (exists) {
        return prev.filter(f => f.id !== article.id);
      } else {
        const newFavorites = [{ ...article, savedAt: Date.now() }, ...prev];
        return newFavorites.slice(0, MAX_FAVORITES);
      }
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
}

// Generate unique ID from article data
export function generateArticleId(title: string, source?: string): string {
  const str = `${title}-${source || ""}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
