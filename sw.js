const CACHE_NAME = 'qrzlog-tactical-v2.5.1';
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
  const req = e.request;

  // 1) Evitar caches para URLs de extensiones del navegador
  if (req.url.startsWith('chrome-extension://')) {
    // Deja que la petición vaya a la red directamente
    return;
  }

  // 2) Estrategia: cache-first con fallback a red
  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(req);

      try {
        // Disparo a la red
        const networkResponse = await fetch(req);
        if (networkResponse && networkResponse.status === 200) {
          // Actualizamos la caché con la respuesta fresca
          await cache.put(req, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        // Si la red falla, usar caché si existe
        if (cachedResponse) return cachedResponse;
        // Si no hay caché, fall back a un mini fallback
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});
