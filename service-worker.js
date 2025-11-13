const CACHE_NAME = 'pubg-tdm-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './css/main.css',
  './css/admin.css',
  './js/app.js',
  './js/admin-app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const url = new URL(request.url);

    try {
      const networkResponse = await fetch(request);
      // Cache same-origin GET responses
      if (url.origin === location.origin) {
        cache.put(request, networkResponse.clone()).catch(() => {});
      }
      return networkResponse;
    } catch (err) {
      // Fallback to cache
      const cached = await cache.match(request);
      if (cached) return cached;

      // If it's navigation, fallback to cached index.html
      if (request.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }

      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});