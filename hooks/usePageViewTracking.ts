import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function usePageViewTracking() {
  const { data: session } = useSession();

  useEffect(() => {
    // Śledź page view
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/page-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session?.user?.id || null,
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          }),
        });
      } catch (error) {
        console.error("Failed to track page view:", error);
      }
    };

    trackPageView();
  }, [session]);
}
