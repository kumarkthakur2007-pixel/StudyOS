// StudyOS Service Worker v1.0
const CACHE_NAME = 'studyos-v1';
const CDN_CACHE = 'studyos-cdn-v1';

// App shell files to cache immediately
const APP_SHELL = [
  './index.html',
  './manifest.json'
];

// CDN libraries to cache
const CDN_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap'
];

// ── INSTALL: Cache app shell + CDN libs ──────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing StudyOS v1...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL);
      }),
      caches.open(CDN_CACHE).then(cache => {
        console.log('[SW] Caching CDN libraries');
        return Promise.allSettled(
          CDN_URLS.map(url => cache.add(url).catch(err => console.log('[SW] CDN cache skip:', url, err)))
        );
      })
    ])
  );
  // Activate immediately without waiting
  self.skipWaiting();
});

// ── ACTIVATE: Clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== CDN_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: Cache-first for CDN, Network-first for app ────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // CDN resources → Cache First (they never change)
  if (
    url.hostname.includes('cdnjs.cloudflare.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.open(CDN_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached); // offline fallback
        })
      )
    );
    return;
  }

  // App HTML → Network first, fallback to cache (so updates are picked up)
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(cached => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // Everything else → Cache first, then network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// ── BACKGROUND SYNC (future: sync data when back online) ────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
  }
});

// ── PUSH NOTIFICATIONS (future use) ─────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'StudyOS', body: 'Time to study! 📚' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './manifest.json',
      badge: './manifest.json',
      vibrate: [100, 50, 100],
      tag: 'studyos-reminder'
    })
  );
});
