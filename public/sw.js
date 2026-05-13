/**
 * PWA Service Worker · v1.0
 *
 * 缓存策略：Cache-First（优先缓存）
 * 缓存名称：shanhai-v1
 */

const CACHE = 'shanhai-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install: precache core assets
self.addEventListener('install', (e: ExtendableEvent) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e: ExtendableEvent) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      )
    )
  );
  (self as unknown as ServiceWorkerGlobalScope).clients.claim();
});

// Fetch: Cache-First
self.addEventListener('fetch', (e: FetchEvent) => {
  const url = new URL(e.request.url);

  // Skip non-GET and cross-origin
  if (e.request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (!res.ok) return res;
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        return res;
      });
    })
  );
});

export {};