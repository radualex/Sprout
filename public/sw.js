/* Sprout service worker.
 *
 * Caching is deliberately minimal: only static shell assets are cached,
 * cache-first. Documents, /api responses and per-user data are NEVER cached —
 * the old cache-everything strategy would leak one user's HTML to another.
 */
const CACHE = 'sprout-v2';
const SHELL = ['/', '/icon.svg', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest'];

globalThis.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => { return c.addAll(SHELL); }));
    globalThis.skipWaiting();
});

globalThis.addEventListener('activate', (e) => {
    e.waitUntil(
        caches
            .keys()
            .then((keys) => {
                return Promise.all(keys.reduce((accumulator, k) => {
                    if (k !== CACHE) accumulator.push(caches.delete(k));
                    return accumulator;
                }, []));
            })
            .then(() => { return globalThis.clients.claim(); })
    );
});

globalThis.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    if (e.request.method !== 'GET' || url.origin !== location.origin) return;
    // Never cache documents (HTML) or API calls — both are user-specific.
    if (e.request.mode === 'navigate') return;

    e.respondWith(
        caches.match(e.request).then((hit) => {
            return (
                hit ||
                fetch(e.request).then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => { return c.put(e.request, copy); });
                    return res;
                })
            );
        })
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
