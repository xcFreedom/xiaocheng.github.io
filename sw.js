const cacheName = 'v3';
const dataCacheName = 'data-v1';
const cacheFiles = [
  '/',
  '/views/offline.html',
  '/scripts/index.js',
  '/scripts/vconsole.min.js',
  '/styles/index.css',
  '/assets/images/book.png',
  '/assets/images/loading.svg',
];

self.addEventListener('install', (e) => {
  console.log('install success', e);
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(cacheFiles))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keyList => (
        Promise.all(
          keyList.map(key => key !== cacheName ? caches.delete(key) : Promise.resolve())
        )
      ))
  )
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.mode);
  e.respondWith(
    fetch(e.request)
      .catch(() => (
        caches.open(cacheName)
          .then(cache => cache.match(e.request.url))
          .catch((err) => {
            console.log(err);
          })
      ))
  )
});