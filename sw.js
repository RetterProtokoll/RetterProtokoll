// Erhöhe diese Versionsnummer (z.B. v1 zu v2), wenn du dein HTML aktualisierst!
const CACHE_NAME = 'emergency-doc-cache-v1';

// Hier trägst du alle Dateien ein, die offline verfügbar sein müssen
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'sw.js',
  'icon.png'
  // Falls du irgendwann eigene .css oder .js Dateien hast, trägst du sie einfach hier ein
];

// 1. App-Dateien beim ersten Laden im Handy speichern
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Dateien werden für den Offline-Modus gecached...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Erzwingt, dass der neue SW sofort aktiv wird
  );
});

// 2. Altes Cache-Material löschen, wenn die Versionsnummer erhöht wurde
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Alten App-Cache gelöscht:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Übernimmt sofort die Kontrolle über alle Seiten
  );
});

// 3. Anfragen abfangen: Erst im lokalen Speicher nachsehen, sonst aus dem Internet laden
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Datei existiert lokal, blitzschnell ausgeben
      }
      return fetch(event.request); // Nicht im Cache? Dann normal aus dem Web laden
    })
  );
});