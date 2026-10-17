/* BOZP Audit – Stanislav Frýželka. Independent, path-scoped offline cache. */
const CACHE = 'bozp-stanislav-offline-v1';
const APP = new URL('./', self.registration.scope);
const INDEX = new URL('index.html', APP).href;
const ASSETS = [INDEX, new URL('manifest.webmanifest', APP).href];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(async cache => {
    await cache.add(INDEX);
    await Promise.allSettled(ASSETS.slice(1).map(url => cache.add(url)));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('bozp-stanislav-offline-') && key !== CACHE)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== APP.origin || !url.href.startsWith(APP.href)) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(INDEX, copy)));
      }
      return response;
    }).catch(() => caches.match(INDEX).then(cached => cached || Response.error())));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => {
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(req, copy)));
    }
    return response;
  })));
});
