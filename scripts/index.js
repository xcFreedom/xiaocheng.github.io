const isSuppoerServiceWorker = () => 'serviceWorker' in window.navigator;

if (isSuppoerServiceWorker()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {

      })
      .catch((err) => {
        console.log('service worker注册失败：', err);
      })
  });
} else {
  alert('浏览器不支持sw');
}
