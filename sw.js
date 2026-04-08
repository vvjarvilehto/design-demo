const CACHE = 'tietovisa-v15';

const COUNTDOWN_DB = 'perhepakki-countdown';
const COUNTDOWN_DB_VER = 2;
const COUNTDOWN_STORE = 'timers';
const COUNTDOWN_TIMERS_KEY = 'timers';
const COUNTDOWN_LEGACY_ACTIVE_KEY = 'active';
/** Herätä ajastinlogiikkaa usein — mobiili voi tappaa SW:n; lyhyempi chunk parantaa osumaa. */
const COUNTDOWN_WAKE_CHUNK_MS = 60 * 1000;

let countdownAlarmTimer = null;
let countdownFetchCheckAt = 0;

function countdownClearAlarmTimer() {
  if (countdownAlarmTimer) {
    clearTimeout(countdownAlarmTimer);
    countdownAlarmTimer = null;
  }
}

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
      if (e.oldVersion < 2 && e.oldVersion >= 1) {
        const tx = e.target.transaction;
        const store = tx.objectStore(COUNTDOWN_STORE);
        const g = store.get(COUNTDOWN_LEGACY_ACTIVE_KEY);
        g.onsuccess = () => {
          const active = g.result;
          if (active && active.targetEndMs) {
            const withId = active.id
              ? active
              : { ...active, id: `m-${active.targetEndMs}` };
            store.put([withId], COUNTDOWN_TIMERS_KEY);
          }
          store.delete(COUNTDOWN_LEGACY_ACTIVE_KEY);
        };
      }
    };
  });
}

async function countdownIdbGetTimers() {
  const db = await countdownOpenDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COUNTDOWN_STORE, 'readonly');
    const r = tx.objectStore(COUNTDOWN_STORE).get(COUNTDOWN_TIMERS_KEY);
    r.onsuccess = () => {
      const list = r.result;
      resolve(Array.isArray(list) ? list : []);
    };
    r.onerror = () => reject(r.error);
  });
}

async function countdownIdbSaveTimers(list) {
  const db = await countdownOpenDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COUNTDOWN_STORE, 'readwrite');
    tx.objectStore(COUNTDOWN_STORE).put(list, COUNTDOWN_TIMERS_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function countdownIdbUpsertTimer(rec) {
  const list = await countdownIdbGetTimers();
  const idx = list.findIndex((t) => t.id === rec.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...rec };
  else list.push(rec);
  await countdownIdbSaveTimers(list);
}

async function countdownIdbRemoveTimer(id) {
  const list = (await countdownIdbGetTimers()).filter((t) => t.id !== id);
  await countdownIdbSaveTimers(list);
}

async function countdownIdbClearAllTimers() {
  await countdownIdbSaveTimers([]);
}

async function countdownNotifyDone(rec) {
  try {
    await self.registration.showNotification(rec.name || 'Ajastin', {
      body: 'Aika täynnä!',
      icon: 'icon.svg',
      badge: 'icon.svg',
      tag: `countdown-end-${rec.id}`,
      renotify: true,
      requireInteraction: false,
      vibrate: [180, 80, 180],
      silent: false,
    });
  } catch (e) {}
}

async function countdownBroadcastEndedBatch(ended) {
  if (!ended || ended.length === 0) return;
  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const payload = {
      type: 'COUNTDOWN_ENDED_BATCH',
      ended: ended.map((t) => ({ id: t.id, name: t.name || '' })),
    };
    clients.forEach((c) => {
      try {
        c.postMessage(payload);
      } catch (err) {}
    });
  } catch (e) {}
}

async function countdownProcessDueTimers() {
  const list = await countdownIdbGetTimers();
  const now = Date.now();
  const due = list.filter((t) => t.targetEndMs && t.targetEndMs <= now);
  if (due.length === 0) return;
  const remaining = list.filter((t) => !t.targetEndMs || t.targetEndMs > now);
  await countdownIdbSaveTimers(remaining);
  for (const rec of due) {
    await countdownNotifyDone(rec);
  }
  await countdownBroadcastEndedBatch(due);
}

async function countdownScheduleFromIdb() {
  countdownClearAlarmTimer();

  const scheduleNext = async () => {
    const list = await countdownIdbGetTimers();
    const now = Date.now();
    const future = list.filter((t) => t.targetEndMs && t.targetEndMs > now);
    if (future.length === 0) return;

    const nextEnd = Math.min(...future.map((t) => t.targetEndMs));
    const left = nextEnd - Date.now();
    if (left <= 0) {
      await countdownProcessDueTimers();
      await scheduleNext();
      return;
    }
    const wait = Math.min(left, COUNTDOWN_WAKE_CHUNK_MS);
    countdownAlarmTimer = setTimeout(async () => {
      await countdownProcessDueTimers();
      await scheduleNext();
    }, wait);
  };

  await scheduleNext();
}

async function countdownCheckExpiredFromIdb() {
  await countdownProcessDueTimers();
  await countdownScheduleFromIdb();
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
      countdownIdbUpsertTimer(rec).then(() => countdownScheduleFromIdb())
    );
    return;
  }

  if (d.type === 'COUNTDOWN_REMOVE') {
    const id = d.id;
    if (!id) return;
    e.waitUntil(
      countdownIdbRemoveTimer(id).then(() => countdownScheduleFromIdb())
    );
    return;
  }

  if (d.type === 'COUNTDOWN_CLEAR') {
    e.waitUntil(
      Promise.resolve()
        .then(() => countdownClearAlarmTimer())
        .then(() => countdownIdbClearAllTimers())
        .then(() => countdownScheduleFromIdb())
    );
    return;
  }

  if (d.type === 'COUNTDOWN_SYNC_ALL') {
    const timers = Array.isArray(d.timers) ? d.timers : [];
    e.waitUntil(
      countdownIdbSaveTimers(timers).then(() => countdownScheduleFromIdb())
    );
    return;
  }

  if (d.type === 'COUNTDOWN_GET_ACTIVE' && e.source) {
    e.waitUntil(
      countdownIdbGetTimers().then((timers) => {
        try {
          e.source.postMessage({ type: 'COUNTDOWN_ACTIVE_STATE', timers });
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

// Chrome: herättää SW:n ajoittain (vaatii käyttöoikeuden; ei kaikilla alustoilla)
self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'countdown-check') {
    e.waitUntil(countdownCheckExpiredFromIdb());
  }
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

  if (sameOrigin && Date.now() - countdownFetchCheckAt > 3000) {
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
