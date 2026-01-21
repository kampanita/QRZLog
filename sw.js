const CACHE_NAME = 'qrzlog-tactical-v1';
// Cacheamos SOLO lo local para asegurar la instalación
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (e) => {
  // Fuerza al SW a tomar el control inmediatamente
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando assets locales...');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  // Limpia cachés antiguas si cambias el CACHE_NAME
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Si está en caché, lo devuelve. Si no, va a la red.
      return res || fetch(e.request).catch(() => {
        // Fallback por si no hay red y no está cacheado
        console.log('Offline y sin asset cacheado');
      });
    })
  );
});
