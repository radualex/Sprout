/* Sprout service worker: offline shell cache + notification click handling. */
const CACHE = 'sprout-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg'];

globalThis.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => { return c.addAll(SHELL); }));
    globalThis.skipWaiting();
});

globalThis.addEventListener('activate', (e) => {
    e.waitUntil(
        caches
            .keys()
            .then((keys) => { return Promise.all(keys.reduce((accumulator, k) => { if (k !== CACHE) accumulator.push(caches.delete(k)); return accumulator; }, [])); })
            .then(() => { return globalThis.clients.claim(); })
    );
});

globalThis.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    if (e.request.method !== 'GET' || url.origin !== location.origin) return;
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                const copy = res.clone();
                caches.open(CACHE).then((c) => { return c.put(e.request, copy); });
                return res;
            })
            .catch(() => { return caches.match(e.request).then((hit) => { return hit || caches.match('/'); }); })
    );
});

globalThis.addEventListener('notificationclick', (e) => {
    e.notification.close();
    e.waitUntil(
        globalThis.clients.matchAll({ type: 'window',
            includeUncontrolled: true }).then((clients) => {
            const open = clients.find((c) => { return 'focus' in c; });
            if (open) return open.focus();
            return globalThis.clients.openWindow('/');
        })
    );
});

/* Periodic background sync (Chrome/Android installed PWAs): re-check care schedule. */
globalThis.addEventListener('periodicsync', (e) => {
    if (e.tag === 'sprout-care-check') {
        e.waitUntil(
            globalThis.clients.matchAll().then((clients) => {
                clients.forEach((c) => { return c.postMessage({ type: 'care-check' }); });
            })
        );
    }
});
