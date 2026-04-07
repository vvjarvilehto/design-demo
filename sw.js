const CACHE = 'tietovisa-v12';

const PRECACHE = [
  './',
  'index.html',
  'countdown.html',
  'aurora.html',
  'trivia.html',
  'trivia.json',
  'questions-aikuiset.js',
  'manifest.json',
  'icon.svg',
  'sw.js',
];

// Asennus: esitallennetaan paikalliset tiedostot
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Aktivointi: poistetaan vanhat välimuistit
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: välimuisti ensin, sitten verkko – tallennetaan CDN-resurssit myös
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isTriviaData = ['questions-aikuiset.js', 'trivia.json']
    .some(path => url.pathname.endsWith(path));

  // Revontuli-/sää-API:t: aina verkko, jotta Kp ja pilvisyys eivät jää vanhaan välimuistiin
  if (url.hostname === 'services.swpc.noaa.gov' || url.hostname === 'api.open-meteo.com') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('index.html'))
    );
    return;
  }

  // Kysymyspankit: verkko ensin, jotta uudet kysymykset päivittyvät heti.
  if (isTriviaData) {
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  const sameOrigin = url.origin === self.location.origin;

  // Sama origin (sivut, skriptit, manifest): verkko ensin — Safari/PWA ei jää vanhaan cacheen.
  if (sameOrigin) {
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() =>
        caches.match(e.request).then(cached => cached || caches.match('index.html'))
      )
    );
    return;
  }

  // Ulkoinen (Tailwind CDN, fontit): välimuisti ensin — nopeampi ja toimii offline-tilassa paremmin
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(resp => {
        if (resp && (resp.status === 200 || resp.type === 'opaque')) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('index.html'));
    })
  );
});
