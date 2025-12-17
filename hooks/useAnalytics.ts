import { useEffect, useRef } from "react";
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
  eventData?: Record<string, any>;
}

export function useAnalytics() {
  const { data: session } = useSession();
  const startTimeRef = useRef<number>(Date.now());
  const scrollTrackRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Śledź widok strony
   */
  const trackPageView = async (data: TrackPageViewData) => {
    try {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

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
  };

  /**
   * Śledź widok artykułu
   */
  const trackArticleView = async (data: TrackArticleViewData) => {
    try {
      const duration = data.duration || Math.round((Date.now() - startTimeRef.current) / 1000);
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
  };

  /**
   * Śledź zdarzenie
   */
  const trackEvent = async (data: TrackEventData) => {
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
  };

  /**
   * Oblicz głębokość scroll
   */
  const calculateScrollDepth = (): number => {
    if (!document.documentElement.scrollHeight) return 0;
    const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    return Math.round(Math.min(scrolled, 1) * 100);
  };

  /**
   * Setup automatycznego śledzenia scroll depth
   */
  useEffect(() => {
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
  }, []);

  return {
    trackPageView,
    trackArticleView,
    trackEvent,
  };
}
