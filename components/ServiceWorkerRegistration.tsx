"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Register SW after page load
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        console.log("✅ Service Worker registered");

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000); // Every 5 minutes

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New version available - could show a toast notification
              console.log("🔄 New version available");
            }
          });
        });
      } catch (error) {
        console.warn("Service Worker registration failed:", error);
      }
    };

    // Wait for page to load
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
      return () => window.removeEventListener("load", registerSW);
    }
  }, []);

  return null;
}

