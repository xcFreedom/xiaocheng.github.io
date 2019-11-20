const cacheName = 'v3';
const dataCacheName = 'data-v1';
const cacheFiles = [
  './',
  './views/offline.html',
  './scripts/index.js',
  './scripts/vconsole.min.js',
  './styles/index.css',
  './assets/images/book.png',
  './assets/images/loading.svg',
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

self.addEventListener('push', (e) => {
  let data = e.data;
  if (e.data) {
    data = data.json();
    console.log('push data', data);
    var title = 'PWA即学即用';
    var options = {
        body: data,
        icon: './assets/images/book-128.png',
        image: './assets/images/book-521.png', // no effect
        actions: [{
            action: 'show-book',
            title: '去看看'
        }, {
            action: 'contact-me',
            title: '联系我'
        }],
        tag: 'pwa-starter',
        renotify: true
    };
    self.registration.showNotification(title, options);
  } else {
    console.log('push 没有数据');
  }
});

self.addEventListener('notificationclick', (e) => {
  let { action } = e;
  
  console.log(`action tag: ${e.notification.tag}`, `action: ${action}`);

  switch (action) {
    case 'show-book':
        console.log('show-book');
        break;
    case 'contact-me':
        console.log('contact-me');
        break;
    default:
        console.log(`未处理的action: ${e.action}`);
        action = 'default';
        break;
  }
  e.notification.close();

  e.waitUntil(
    // 获取所有clients
    self.clients.matchAll().then(function (clients) {
        if (!clients || clients.length === 0) {
            self.clients.openWindow && self.clients.openWindow('http://127.0.0.1:8085');
            return;
        }
        clients[0].focus && clients[0].focus();
        clients.forEach(function (client) {
            // 使用postMessage进行通信
            client.postMessage(action);
        });
    })
  );
});