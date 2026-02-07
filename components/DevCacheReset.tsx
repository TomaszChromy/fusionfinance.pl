"use client";

import { useEffect } from "react";

// Dev-only helper to purge stale service workers and caches that might serve old bundles
export default function DevCacheReset() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Unregister any SW and clear all caches
    navigator.serviceWorker?.getRegistrations?.().then((regs) => regs.forEach((r) => r.unregister()));
    if (window.caches) {
      window.caches.keys().then((keys) => keys.forEach((key) => window.caches.delete(key)));
    }
  }, []);

  return null;
}
