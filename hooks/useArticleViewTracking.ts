import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export function useArticleViewTracking(articleId: string, title: string, slug: string) {
  const { data: session } = useSession();
  const startTimeRef = useRef<number>(0);
  const maxScrollRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

      if (duration > 5) {
        // Śledź tylko jeśli użytkownik spędził więcej niż 5 sekund
        try {
          await fetch("/api/analytics/article-view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session?.user?.id || null,
              articleId,
              title,
              slug,
              duration,
              scrollDepth: Math.round(maxScrollRef.current),
            }),
          });
        } catch (error) {
          console.error("Failed to track article view:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [articleId, title, slug, session]);
}
