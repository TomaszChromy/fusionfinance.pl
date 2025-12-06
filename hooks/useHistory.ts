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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryItem[];
        setHistory(parsed);
      }
    } catch {
      console.error("Failed to load history");
    }
    setIsLoaded(true);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch {
        console.error("Failed to save history");
      }
    }
  }, [history, isLoaded]);

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

