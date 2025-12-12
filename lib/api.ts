/**
 * API URL helper for hybrid deployment (Next.js dev + PHP production)
 * 
 * In development (localhost:3000): Uses Next.js API routes (/api/rss)
 * In production (static export): Uses PHP API (/api/rss.php)
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
 * Check if we're running on localhost with Next.js dev server
 */
export function isNextDevServer(): boolean {
  if (typeof window === "undefined") return false;
  const { hostname, port } = window.location;
  // Next.js dev runs on port 3000 or 3001 (fallback when 3000 is busy)
  // Static serve typically uses other ports like 8000, 8080, 5000, etc.
  return (hostname === "localhost" || hostname === "127.0.0.1") && (port === "3000" || port === "3001");
}

/**
 * Get the correct API URL based on environment
 * @param endpoint - API endpoint (e.g., "rss", "article")
 * @param params - Query parameters
 */
export function getApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  // Use Next.js API only on port 3000 (dev server)
  const useNextApi = isNextDevServer();
  
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

