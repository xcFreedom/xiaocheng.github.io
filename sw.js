const _self = this;

_self.addEventListener('install', () => {
  console.log('install success');
});

_self.addEventListener('activate', () => {
  console.log('activate');
});

_self.clients.matchAll().then((clients) => {
  console.log(clients);
  clients.forEach((client) => {
    client.postMessage('service worker is Activated');
  });
}).catch((e) => {
  console.log('clients error', e)
})