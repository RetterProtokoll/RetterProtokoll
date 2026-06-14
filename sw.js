// Cache-Version erhöht, um alte Offline-Fehler auf dem Smartphone zu löschen
const CACHE_NAME = 'retter-protokoll-cache-v4';

// Liste der Dateien im exakten Unterordner, die offline gespeichert werden
const ASSETS_TO_CACHE = [
  '/RetterProtokoll/',
  '/RetterProtokoll/index.html',
  '/RetterProtokoll/manifest.json',
  '/RetterProtokoll/sw.js',
  '/RetterProtokoll/logo.png'
];

// 1. Dateien beim ersten Laden lokal sichern
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('RetterProtokoll: Sichere Anwendungsdaten für den Offline-Modus...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Alten Cache verwerfen, sobald sich die Version erhöht
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

// 3. Anfragen abfangen und blitzschnell lokal beantworten
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Lokal gefunden!
      }
      return fetch(event.request); // Nicht im Cache, lade normal aus dem Netz
    })
  );
});