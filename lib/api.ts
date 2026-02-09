/**
 * API URL helper for deployment
 *
 * On Vercel/localhost: Uses Next.js API routes (/api/rss)
 * On static hosting with PHP: Uses PHP API (/api/rss.php)
 */

/**
 * Check if we're running on localhost (dev server)
 */
export function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/**
 * Check if we should use Next.js API routes
 * Returns true for: localhost, Vercel, or any Node.js hosting
 * Returns false for: static hosting with PHP backend
 */
export function shouldUseNextApi(): boolean {
  const isStaticExport =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ||
        process.env.STATIC_EXPORT === "true")) ||
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_USE_PHP_API === "true");

  if (isStaticExport) return false;

  if (typeof window === "undefined") return true; // SSR - always use Next.js API

  const { hostname, port } = window.location;

  // Localhost with Next.js dev server
  if ((hostname === "localhost" || hostname === "127.0.0.1") && (port === "3000" || port === "3001")) {
    return true;
  }

  // Vercel deployment (*.vercel.app or custom domain on Vercel)
  if (hostname.endsWith(".vercel.app") || hostname.includes("vercel")) {
    return true;
  }

  // Custom domains on Vercel - check for NEXT_PUBLIC env or assume Vercel if not static
  // If the hostname is a production domain (fusionfinance.pl), use Next.js API
  if (hostname.endsWith(".app") || hostname.includes("fusionfinance")) {
    return true;
  }

  // Default: use Next.js API (safer for Vercel deployments)
  // Only static PHP hosting should return false
  return true;
}

/**
 * @deprecated Use shouldUseNextApi() instead
 */
export function isNextDevServer(): boolean {
  return shouldUseNextApi();
}

/**
 * Get the correct API URL based on environment
 * @param endpoint - API endpoint (e.g., "rss", "article")
 * @param params - Query parameters
 */
export function getApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  // Use Next.js API on Vercel and localhost
  const useNextApi = shouldUseNextApi();

  // Build base URL
  const baseUrl = useNextApi ? `/api/${endpoint}` : `/api/${endpoint}.php`;
  
  // Add query parameters
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      searchParams.set(key, String(value));
    }
    return `${baseUrl}?${searchParams.toString()}`;
  }
  
  return baseUrl;
}

/**
 * Fetch from the correct API endpoint
 * @param endpoint - API endpoint (e.g., "rss", "article")
 * @param params - Query parameters
 * @param options - Fetch options
 */
export async function fetchApi<T>(
  endpoint: string,
  params?: Record<string, string | number>,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint, params);
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * RSS API helper
 */
export function getRssApiUrl(feed: string, limit: number = 10): string {
  return getApiUrl("rss", { feed, limit });
}

/**
 * Article API helper
 */
export function getArticleApiUrl(url: string): string {
  return getApiUrl("article", { url });
}
