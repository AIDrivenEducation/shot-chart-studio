
const CACHE_NAME = 'scs-cache-v3';
const CORE = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE_NAME && caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req); if (cached) return cached;
    try { const res = await fetch(req);
      if (res && res.ok && new URL(req.url).origin === location.origin) cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (req.mode === 'navigate') { const offline = await cache.match('./index.html'); if (offline) return offline; }
      throw err;
    }
  })());
});
