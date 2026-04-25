/**
 * Service Worker для Kanavto PWA.
 *
 * Стратегии кеширования:
 *  - Static assets (CSS/JS/шрифты): cache-first
 *  - API: network-only (нельзя кешировать актуальные данные о записях)
 *  - HTML pages: network-first с fallback на офлайн-страницу
 *  - Документы (/api/orders/*/pdf): cache-first (с TTL через Cache-Control)
 */

const CACHE_VERSION = "kanavto-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PDF_CACHE = `${CACHE_VERSION}-pdf`;

const OFFLINE_URL = "/offline";
const CACHED_ROUTES = [OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CACHED_ROUTES)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Не кешируем API кроме PDF
  if (url.pathname.startsWith("/api/")) {
    if (url.pathname.includes("/pdf")) {
      event.respondWith(cacheFirst(req, PDF_CACHE));
    }
    return;
  }

  // _next/* — статика
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // HTML страницы — network-first с offline fallback
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const response = await fetch(req);
    if (response.ok) cache.put(req, response.clone());
    return response;
  } catch {
    return cached || new Response("Offline", { status: 503 });
  }
}

async function networkFirst(req) {
  try {
    const response = await fetch(req);
    return response;
  } catch {
    const cache = await caches.open(STATIC_CACHE);
    const offline = await cache.match(OFFLINE_URL);
    return offline || new Response("Offline", { status: 503, headers: { "Content-Type": "text/html" } });
  }
}
