/**
 * FusionFinance.pl - Service Worker
 * Strategia cache: Network First z fallback na cache
 */

const CACHE_NAME = 'fusionfinance-v1';
const STATIC_CACHE = 'fusionfinance-static-v1';
const API_CACHE = 'fusionfinance-api-v1';

// Statyczne zasoby do pre-cache
const STATIC_ASSETS = [
  '/',
  '/offline/',
  '/manifest.json',
  '/favicon.ico',
  '/og-image.svg',
];

// API endpoints z różnym TTL (w sekundach)
const API_CACHE_CONFIG = {
  '/api/rss': 300,        // 5 min - newsy
  '/api/nbp': 3600,       // 1h - kursy NBP
  '/api/crypto': 60,      // 1 min - crypto
  '/api/stocks': 300,     // 5 min - giełda
  '/api/article': 1800,   // 30 min - artykuły
};

// Install - pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== STATIC_CACHE && key !== API_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch - Network First z cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API requests - stale-while-revalidate
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request, url));
    return;
  }

  // Static assets - cache first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML pages - network first
  event.respondWith(networkFirst(request));
});

// Cache First strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// Network First strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Fallback to offline page
    return caches.match('/offline/') || new Response('Offline', { status: 503 });
  }
}

// API requests with TTL cache
async function handleApiRequest(request, url) {
  const cacheKey = Object.keys(API_CACHE_CONFIG).find(key => url.pathname.startsWith(key));
  const ttl = cacheKey ? API_CACHE_CONFIG[cacheKey] : 300;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      const headers = new Headers(response.headers);
      headers.set('sw-cache-time', Date.now().toString());
      
      const cachedResponse = new Response(await response.clone().blob(), {
        status: response.status,
        headers
      });
      cache.put(request, cachedResponse);
    }
    return response;
  } catch {
    // Try cache
    const cached = await caches.match(request);
    if (cached) {
      const cacheTime = parseInt(cached.headers.get('sw-cache-time') || '0');
      const age = (Date.now() - cacheTime) / 1000;
      
      // Return even stale cache if offline
      if (age < ttl * 10) return cached;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Check if static asset
function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/.test(pathname);
}

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

