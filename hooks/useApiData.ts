"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

// Generic hook for fetching data from API
export function useApiData<T>(endpoint: string, initialData: T[] = []) {
  const { data: session } = useSession();
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const result = await res.json();
        if (Array.isArray(result)) {
          setData(result);
        }
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [endpoint, session?.user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    setLoading(true);
    fetchData();
  };

  return { data, loading, error, refetch, setData };
}

// Hook for alerts
export function useAlerts() {
  const { data: alerts, loading, refetch, setData } = useApiData<{
    id: string;
    symbol: string;
    condition: string;
    price: number;
    isActive: boolean;
    triggered: boolean;
  }>("/api/alerts");

  const addAlert = async (alert: { symbol: string; price: number; condition: string }) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      });
      if (res.ok) {
        refetch();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteAlert = async (id: string) => {
    try {
      await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
      setData(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      setData(prev => prev.map(a => a.id === id ? { ...a, isActive: !isActive } : a));
    } catch (err) {
      console.error(err);
    }
  };

  return { alerts, loading, addAlert, deleteAlert, toggleAlert, refetch };
}

// Hook for watchlist
export function useWatchlist() {
  const { data: items, loading, refetch, setData } = useApiData<{
    id: string;
    symbol: string;
    name: string;
    type: string;
  }>("/api/watchlist");

  const addItem = async (item: { symbol: string; name?: string; type: string }) => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        refetch();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const removeItem = async (symbol: string) => {
    try {
      await fetch(`/api/watchlist?symbol=${symbol}`, { method: "DELETE" });
      setData(prev => prev.filter(i => i.symbol !== symbol));
    } catch (err) {
      console.error(err);
    }
  };

  return { items, loading, addItem, removeItem, refetch };
}

// Hook for favorites (articles)
export function useApiFavorites() {
  const { data: favorites, loading, refetch, setData } = useApiData<{
    id: string;
    articleId: string;
    title: string;
    url?: string;
    imageUrl?: string;
    createdAt: string;
  }>("/api/favorites");

  const addFavorite = async (article: { articleId: string; title: string; url?: string; imageUrl?: string }) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
      if (res.ok) {
        refetch();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const removeFavorite = async (articleId: string) => {
    try {
      await fetch(`/api/favorites?articleId=${articleId}`, { method: "DELETE" });
      setData(prev => prev.filter(f => f.articleId !== articleId));
    } catch (err) {
      console.error(err);
    }
  };

  const isFavorite = (articleId: string) => favorites.some(f => f.articleId === articleId);

  return { favorites, loading, addFavorite, removeFavorite, isFavorite, refetch };
}

