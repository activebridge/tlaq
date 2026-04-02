---
layout: null
---

// Build version: {{ site.time | date: '%Y%m%d%H%M%S' }}

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

const OFFLINE_URL = '/offline.html';
const OFFLINE_CACHE = 'offline-{{ site.time | date: "%Y%m%d%H%M%S" }}';
const ONE_YEAR = 365 * 24 * 60 * 60;
const cacheable200 = new CacheableResponsePlugin({ statuses: [200] });

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(OFFLINE_CACHE).then((cache) => cache.addAll([OFFLINE_URL, '/assets/css/application.css', '/assets/js/search.js']))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('offline-') && k !== OFFLINE_CACHE).map((k) => caches.delete(k)))));
});

registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ request }) => fetch(request).catch(() => caches.match(OFFLINE_URL, { cacheName: OFFLINE_CACHE }))
);

registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({ cacheName: 'assets', plugins: [cacheable200] })
);

registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({ cacheName: 'fonts', plugins: [cacheable200, new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: ONE_YEAR })] })
);

// Runtime caching is intentionally disabled for now.
// Keep the service worker registration to preserve PWA support.
//
// registerRoute(
//   ({ request }) => request.mode === 'navigate',
//   new StaleWhileRevalidate({
//     cacheName: 'pages',
//     plugins: [
//       new CacheableResponsePlugin({ statuses: [200] }),
//       new ExpirationPlugin({ maxEntries: 50 }),
//     ],
//   })
// );
//
// registerRoute(
//   ({ request }) => request.destination === 'style',
//   new StaleWhileRevalidate({
//     cacheName: 'styles',
//     plugins: [
//       new CacheableResponsePlugin({ statuses: [200] }),
//       new ExpirationPlugin({ maxEntries: 20 }),
//     ],
//   })
// );
//
// registerRoute(
//   ({ request }) => request.destination === 'script',
//   new StaleWhileRevalidate({
//     cacheName: 'scripts',
//     plugins: [
//       new CacheableResponsePlugin({ statuses: [200] }),
//       new ExpirationPlugin({ maxEntries: 20 }),
//     ],
//   })
// );
//
// registerRoute(
//   ({ request }) => request.destination === 'image',
//   new StaleWhileRevalidate({
//     cacheName: 'images',
//     plugins: [
//       new CacheableResponsePlugin({ statuses: [200] }),
//       new ExpirationPlugin({
//         maxEntries: 100,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
//       }),
//     ],
//   })
// );
//
// registerRoute(
//   ({ request }) => request.destination === 'font',
//   new CacheFirst({
//     cacheName: 'fonts',
//     plugins: [
//       new CacheableResponsePlugin({ statuses: [200] }),
//       new ExpirationPlugin({
//         maxEntries: 10,
//         maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
//       }),
//     ],
//   })
// );
//
// registerRoute(
//   ({ url }) => url.origin === '{{ site.cdn_url }}',
//   new StaleWhileRevalidate({
//     cacheName: 'cdn-assets',
//     plugins: [
//       new CacheableResponsePlugin({ statuses: [200] }),
//       new ExpirationPlugin({
//         maxEntries: 200,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
//       }),
//     ],
//   })
// );
