"use client";

import { useState, useEffect, useCallback } from "react";

export interface HistoryItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  source?: string;
  date?: string;
  url?: string;
  viewedAt: number;
}

const STORAGE_KEY = "fusionfinance_history";
const MAX_HISTORY = 30;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as HistoryItem[];
      }
    } catch {
      console.error("Failed to load history");
    }
    return [];
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      console.error("Failed to save history");
    }
  }, [history]);

  const addToHistory = useCallback((item: Omit<HistoryItem, "viewedAt">) => {
    setHistory(prev => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter(h => h.id !== item.id);
      // Add new item at the beginning, limit to MAX_HISTORY
      const newHistory = [{ ...item, viewedAt: Date.now() }, ...filtered];
      return newHistory.slice(0, MAX_HISTORY);
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const isInHistory = useCallback((id: string) => {
    return history.some(h => h.id === id);
  }, [history]);

  return {
    history,
    isLoaded,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isInHistory,
    count: history.length,
  };
}

// Generate unique ID from article data
export function generateHistoryId(title: string, source?: string): string {
  const str = `${title}-${source || ""}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
