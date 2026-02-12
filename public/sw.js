/// <reference lib="webworker" />

const CACHE_NAME = "arkive-v1";
const STATIC_ASSETS = [
  "/",
  "/shop",
  "/flash-sale",
  "/cart",
  "/manifest.json",
];

const sw = self as unknown as ServiceWorkerGlobalScope;

// Install — pre-cache shell
sw.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => sw.skipWaiting())
  );
});

// Activate — clean old caches
sw.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => sw.clients.claim())
  );
});

// Fetch — network-first for pages, cache-first for assets
sw.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== sw.location.origin) return;

  // Skip API routes — always network
  if (url.pathname.startsWith("/api/")) return;

  // Images and static assets — cache-first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?)$/) ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Pages — network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) =>
            cached ||
            caches.match("/").then((fallback) => fallback || new Response("Offline", { status: 503 }))
        )
      )
  );
});
