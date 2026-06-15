// Cache-Version auf v5 erhöht für die Namensänderung
const CACHE_NAME = 'retter-protokoll-cache-v7';

const ASSETS_TO_CACHE = [
  '/RetterProtokoll/',
  '/RetterProtokoll/index.html',
  '/RetterProtokoll/manifest.json',
  '/RetterProtokoll/sw.js',
  '/RetterProtokoll/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('RetterProtokoll: Sichere Anwendungsdaten für den Offline-Modus...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('RetterProtokoll: Veralteten App-Cache gelöscht:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
