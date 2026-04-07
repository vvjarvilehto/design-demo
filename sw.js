const CACHE = 'tietovisa-v13';

const COUNTDOWN_DB = 'perhepakki-countdown';
const COUNTDOWN_DB_VER = 1;
const COUNTDOWN_STORE = 'timers';
const COUNTDOWN_WAKE_CHUNK_MS = 5 * 60 * 1000;

let countdownAlarmTimer = null;
let countdownFetchCheckAt = 0;

function countdownOpenDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(COUNTDOWN_DB, COUNTDOWN_DB_VER);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(COUNTDOWN_STORE)) {
        db.createObjectStore(COUNTDOWN_STORE);
      }
    };
  });
}

async function countdownIdbPutActive(rec) {
  const db = await countdownOpenDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COUNTDOWN_STORE, 'readwrite');
    tx.objectStore(COUNTDOWN_STORE).put(rec, 'active');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function countdownIdbGetActive() {
  const db = await countdownOpenDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COUNTDOWN_STORE, 'readonly');
    const r = tx.objectStore(COUNTDOWN_STORE).get('active');
    r.onsuccess = () => resolve(r.result || null);
    r.onerror = () => reject(r.error);
  });
}

async function countdownIdbClearActive() {
  const db = await countdownOpenDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COUNTDOWN_STORE, 'readwrite');
    tx.objectStore(COUNTDOWN_STORE).delete('active');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function countdownClearAlarmTimer() {
  if (countdownAlarmTimer) {
    clearTimeout(countdownAlarmTimer);
    countdownAlarmTimer = null;
  }
}

async function countdownNotifyDone(rec) {
  try {
    await self.registration.showNotification(rec.name || 'Ajastin', {
      body: 'Aika täynnä!',
      icon: 'icon.svg',
      tag: 'countdown-end',
      renotify: true,
    });
  } catch (e) {}
}

async function countdownBroadcastEnded(name) {
  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((c) => {
      try {
        c.postMessage({ type: 'COUNTDOWN_ENDED', name: name || '' });
      } catch (err) {}
    });
  } catch (e) {}
}

async function countdownFireIfDue(rec) {
  const current = await countdownIdbGetActive();
  if (!current || current.targetEndMs !== rec.targetEndMs) return;
  const name = current.name;
  await countdownIdbClearActive();
  countdownClearAlarmTimer();
  await countdownNotifyDone(rec);
  await countdownBroadcastEnded(name);
}

async function countdownScheduleFromIdb() {
  countdownClearAlarmTimer();
  const rec = await countdownIdbGetActive();
  if (!rec || !rec.targetEndMs) return;

  const scheduleChunk = () => {
    const left = rec.targetEndMs - Date.now();
    if (left <= 0) {
      countdownFireIfDue(rec);
      return;
    }
    const wait = Math.min(left, COUNTDOWN_WAKE_CHUNK_MS);
    countdownAlarmTimer = setTimeout(async () => {
      const fresh = await countdownIdbGetActive();
      if (!fresh || fresh.targetEndMs !== rec.targetEndMs) return;
      if (Date.now() >= fresh.targetEndMs) {
        await countdownFireIfDue(fresh);
      } else {
        scheduleChunk();
      }
    }, wait);
  };

  scheduleChunk();
}

async function countdownCheckExpiredFromIdb() {
  const rec = await countdownIdbGetActive();
  if (!rec || !rec.targetEndMs) return;
  if (Date.now() >= rec.targetEndMs) {
    await countdownFireIfDue(rec);
  }
}

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const c of clientList) {
        if ('focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./countdown.html');
    })
  );
});

self.addEventListener('message', (e) => {
  const d = e.data;
  if (!d || typeof d !== 'object') return;

  if (d.type === 'COUNTDOWN_SYNC') {
    const rec = {
      id: d.id,
      name: d.name,
      targetEndMs: d.targetEndMs,
      mode: d.mode,
      eventLabel: d.eventLabel,
      durationTotalMs: d.durationTotalMs,
    };
    e.waitUntil(
      countdownIdbPutActive(rec).then(() => countdownScheduleFromIdb())
    );
    return;
  }

  if (d.type === 'COUNTDOWN_CLEAR') {
    e.waitUntil(
      Promise.resolve()
        .then(() => countdownClearAlarmTimer())
        .then(() => countdownIdbClearActive())
    );
    return;
  }

  if (d.type === 'COUNTDOWN_GET_ACTIVE' && e.source) {
    e.waitUntil(
      countdownIdbGetActive().then((rec) => {
        try {
          e.source.postMessage({ type: 'COUNTDOWN_ACTIVE_STATE', rec: rec || null });
        } catch (err) {}
      })
    );
  }
});

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
      .then(() => countdownScheduleFromIdb())
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

  if (sameOrigin && Date.now() - countdownFetchCheckAt > 8000) {
    countdownFetchCheckAt = Date.now();
    countdownCheckExpiredFromIdb().catch(() => {});
  }

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
