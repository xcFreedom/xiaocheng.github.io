const SERVICE_WORKER_API = 'serviceWorker';
const SERVICE_WORKER_FILE_PATH = './sw.js';

const isSuppoerServiceWorker = () => SERVICE_WORKER_API in window.navigator;

if (isSuppoerServiceWorker()) {
  window.navigator[SERVICE_WORKER_API]
    .register(SERVICE_WORKER_FILE_PATH)
    .then(() => alert('index register sw.js success'))
    .catch(() => alert('index register sw.js fail'))
} else {
  alert('浏览器不支持sw');
}