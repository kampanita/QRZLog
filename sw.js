const CACHE_NAME = 'qrzlog-tactical-v2.5';
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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        // 1. Disparamos la petición a la red
        const fetchedResponse = fetch(e.request).then((networkResponse) => {
          // 2. Si la red responde bien, guardamos la copia fresca en la caché
          if (networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Fallback silencioso si no hay red
          console.log('Modo offline: usando caché');
        });

        // 3. Devolvemos la respuesta cacheada INMEDIATAMENTE (o la de red si no hay caché)
        return cachedResponse || fetchedResponse;
      });
    })
  );
});
