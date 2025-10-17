try { importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'); } catch (e) {}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

if (self.workbox) {
  workbox.setConfig({ debug: false });
  workbox.core.clientsClaim();

  workbox.precaching.precacheAndRoute([
    { url: '/offline.html', revision: null },
  ]);

  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-pages',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50, purgeOnQuotaError: true }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === self.location.origin && /\/_next\/(static|image)\//.test(url.pathname),
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'next-static' })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === self.location.origin && /(favicon\.ico|icon.*\.svg|manifest\.webmanifest)$/.test(url.pathname),
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'static-meta' })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 }),
      ],
    })
  );

  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.mode === 'navigate') {
      const cache = await caches.open(workbox.core.cacheNames.precache);
      const res = await cache.match('/offline.html');
      if (res) return res;
    }
    return Response.error();
  });
}
