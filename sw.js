//Registrar
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  };

//Install
self.addEventListener('install', (e) => {
console.log('[Service Worker] Install');
});

//storing the cache

const cacheName = 'Ani-Manga.list-v3';
const appShellFiles = [
    './',
    './icones',
    './imagens',
    './manifest.json',
    './index.html',
    './manga.html',
    './mal.html',
    './detalhe.html',
    './detalhe.css',
    './anime.css',
];

// the install
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
    })());
  });

// activate: remove caches de versões antigas
self.addEventListener('activate', (e) => {
    e.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)));
    })());
});

// fetch
self.addEventListener('fetch', (e) => {
    console.log(`[Service Worker] Fetched resource ${e.request.url}`);
  });

self.addEventListener('fetch', (e) => {
e.respondWith((async () => {
    // dados/*.json: rede primeiro (mal.json é atualizado pelo GitHub Action), cache só offline
    if (e.request.url.includes('/dados/')) {
        try {
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            cache.put(e.request, response.clone());
            return response;
        } catch {
            return caches.match(e.request);
        }
    }
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
})());
});


