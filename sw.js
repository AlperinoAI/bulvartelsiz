const CACHE_NAME = 'bulvar-telsiz-cache-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js'
];

// Uygulama yüklenirken gerekli dosyaları telefona önbelleğe alır
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Eski önbellekleri temizler
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// İnternet olmasa bile uygulamanın açılmasını sağlar (Çevrimdışı desteği)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});