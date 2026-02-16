// ARKIVE Service Worker v2
const CACHE_NAME = "arkive-v2";
const STATIC_ASSETS = [
  "/",
  "/shop",
  "/flash-sale",
  "/cart",
  "/manifest.json",
];

// Install — pre-cache shell
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(STATIC_ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

// Activate — clean old caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

// Fetch — network-first for pages, cache-first for assets
self.addEventListener("fetch", function (event) {
  var request = event.request;
  var url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Skip API and auth routes — always network
  if (url.pathname.startsWith("/api/")) return;

  // Images and static assets — cache-first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?)$/) ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(request, clone); });
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
      .then(function (response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(request, clone); });
        }
        return response;
      })
      .catch(function () {
        return caches.match(request).then(function (cached) {
          return cached ||
            caches.match("/").then(function (fallback) {
              return fallback || new Response("Offline", { status: 503 });
            });
        });
      })
  );
});
