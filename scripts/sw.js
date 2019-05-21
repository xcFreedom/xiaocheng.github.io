const _self = this;

_self.addEventListener('install', () => {
  alert('install success');
});

_self.addEventListener('activate', () => {
  alert('Activated');
});