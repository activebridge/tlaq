---
layout: null
---

// Build version: {{ site.time | date: '%Y%m%d%H%M%S' }}

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');

const { registerRoute, Route } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { precacheAndRoute } = workbox.precaching;

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
