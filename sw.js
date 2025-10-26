self.addEventListener('install', e=>{
  e.waitUntil(caches.open('rehabmaster-v0.2').then(c=>c.addAll([
    './','./index.html','./styles.css','./app.js','./manifest.webmanifest'
  ])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});