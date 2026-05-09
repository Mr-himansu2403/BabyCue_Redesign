// Cleanup service worker for the single-file BabyCue site.
// The previous build cached removed CSS/JS files and could show stale fallback messages.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', () => {
  return;
});
