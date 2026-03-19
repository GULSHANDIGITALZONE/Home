const CACHE_NAME = "gdz-store-v1";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./store.css",
  "./store.js",
  "./store-config.js",
  "./compare.html",
  "./product.html",
  "./digital.html",
  "./services.html",
  "./faq.html",
  "./privacy.html",
  "./terms.html",
  "./refund-policy.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)).catch(() => null)
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match("./index.html")))
  );
});
