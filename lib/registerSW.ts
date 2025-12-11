/**
 * Service Worker registration helper
 */

export async function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    console.log("SW registered:", registration.scope);

    // Check for updates every 5 minutes
    setInterval(() => {
      registration.update();
    }, 5 * 60 * 1000);

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          // New version available
          if (confirm("Dostępna nowa wersja strony. Odświeżyć?")) {
            newWorker.postMessage("skipWaiting");
            window.location.reload();
          }
        }
      });
    });

    return registration;
  } catch (error) {
    console.error("SW registration failed:", error);
  }
}

export function unregisterServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
  });
}

