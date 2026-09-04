const staticFiles = [
  './t5.html',
  './t5.js',
  './t5.css',
  './manifest.json',
  './t4.js',
  './sw.js',
  './components.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open('v1');
        return cache.addAll(staticFiles);
      } catch (e) {
        console.log(e.message);
      }
    })()
  );
});

self.addEventListener('fetch', (event) => {
  console.log('ServiceWorker Fetch', event.request.url);
  event.respondWith(
    (async () => {
      try {
        const response = await caches.match(event.request);
        return response || fetch(event.request);
      } catch (e) {
        console.log(e.message);
      }
    })()
  );
});
