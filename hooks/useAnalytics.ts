import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface TrackPageViewData {
  path: string;
  title?: string;
  referrer?: string;
}

interface TrackArticleViewData {
  articleId: string;
  title: string;
  slug: string;
  duration?: number;
  scrollDepth?: number;
}

interface TrackEventData {
  eventType: string;
  eventData?: Record<string, unknown>;
}

const getNow = () => Date.now();

export function useAnalytics() {
  const { data: session } = useSession();
  const startTimeRef = useRef<number>(0);

  /**
   * Śledź widok strony
   */
  const trackPageView = useCallback(async (data: TrackPageViewData) => {
    try {
      const duration = Math.round((getNow() - startTimeRef.current) / 1000);

      await fetch("/api/analytics/page-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.email,
          path: data.path,
          title: data.title || document.title,
          referrer: data.referrer || document.referrer,
          duration,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }, [session]);

  /**
   * Oblicz głębokość scroll
   */
  const calculateScrollDepth = useCallback((): number => {
    if (!document.documentElement.scrollHeight) return 0;
    const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    return Math.round(Math.min(scrolled, 1) * 100);
  }, []);

  /**
   * Śledź widok artykułu
   */
  const trackArticleView = useCallback(async (data: TrackArticleViewData) => {
    try {
      const duration = data.duration || Math.round((getNow() - startTimeRef.current) / 1000);
      const scrollDepth = data.scrollDepth || calculateScrollDepth();

      await fetch("/api/analytics/article-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.email,
          articleId: data.articleId,
          title: data.title,
          slug: data.slug,
          duration,
          scrollDepth,
        }),
      });
    } catch (error) {
      console.error("Failed to track article view:", error);
    }
  }, [calculateScrollDepth, session]);

  /**
   * Śledź zdarzenie
   */
  const trackEvent = useCallback(async (data: TrackEventData) => {
    try {
      await fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.email,
          eventType: data.eventType,
          eventData: data.eventData,
        }),
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  }, [session]);

  /**
   * Setup automatycznego śledzenia scroll depth
   */
  useEffect(() => {
    startTimeRef.current = Date.now();

    let lastScrollDepth = 0;

    const handleScroll = () => {
      const currentScrollDepth = calculateScrollDepth();

      // Track co 25% scroll
      if (currentScrollDepth - lastScrollDepth >= 25) {
        lastScrollDepth = Math.floor(currentScrollDepth / 25) * 25;
        trackEvent({
          eventType: "scroll_depth",
          eventData: { depth: lastScrollDepth },
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [calculateScrollDepth, trackEvent]);

  return {
    trackPageView,
    trackArticleView,
    trackEvent,
  };
}
