const CACHE = 'tietovisa-v3';

const PRECACHE = [
  './',
  'index.html',
  'aurora.html',
  'trivia.html',
  'trivia-nuoret.html',
  'trivia.json',
  'questions-aikuiset.js',
  'questions-nuoret.js',
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
  // Revontuli-/sää-API:t: aina verkko, jotta Kp ja pilvisyys eivät jää vanhaan välimuistiin
  if (url.hostname === 'services.swpc.noaa.gov' || url.hostname === 'api.open-meteo.com') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(resp => {
        // Tallennetaan onnistuneet vastaukset (myös läpinäkymättömät CDN-vastaukset)
        if (resp && (resp.status === 200 || resp.type === 'opaque')) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('index.html'));
    })
  );
});
