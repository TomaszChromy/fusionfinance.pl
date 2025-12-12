"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

interface CounterData {
  total: number;
  today: number;
}

export default function VisitCounter() {
  const [counter, setCounter] = useState<CounterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCount = async () => {
      try {
        // Sprawdź czy już zliczono tę sesję
        const sessionCounted = sessionStorage.getItem("visit_counted");
        const action = sessionCounted ? "get" : "count";

        const url = getApiUrl("counter", { action });
        console.log("[VisitCounter] Fetching:", url, "action:", action);

        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            'Accept': 'application/json',
          }
        });

        console.log("[VisitCounter] Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("[VisitCounter] Data:", data);

          if (data.success) {
            setCounter({ total: data.total, today: data.today });

            // Oznacz sesję jako zliczoną tylko po udanym zliczeniu
            if (!sessionCounted && action === "count") {
              sessionStorage.setItem("visit_counted", "1");
            }
          }
        } else {
          console.warn("[VisitCounter] Response not OK:", response.status, response.statusText);
        }
      } catch (error) {
        console.warn("[VisitCounter] Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCount();
  }, []);

  // Format liczby z separatorem tysięcy
  const formatNumber = (num: number) => {
    return num.toLocaleString("pl-PL");
  };

  if (loading || !counter) {
    return (
      <div className="flex items-center justify-center gap-2 text-[10px] text-[#52525b]">
        <span className="inline-block w-3 h-3 border border-[#52525b]/50 border-t-[#c9a962]/50 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 text-[10px] text-[#52525b]">
      <div className="flex items-center gap-1.5">
        <svg className="w-3 h-3 text-[#c9a962]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>Dziś: <span className="text-[#a1a1aa]">{formatNumber(counter.today)}</span></span>
      </div>
      <span className="text-[#c9a962]/30">•</span>
      <div className="flex items-center gap-1.5">
        <svg className="w-3 h-3 text-[#c9a962]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Łącznie: <span className="text-[#a1a1aa]">{formatNumber(counter.total)}</span></span>
      </div>
    </div>
  );
}

