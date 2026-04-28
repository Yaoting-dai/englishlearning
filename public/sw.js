const CACHE_NAME = 'learn-english-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/images/kindergarten.png',
  '/images/elementary.png',
  '/images/middle.png',
  '/images/teacher.png',
  '/images/icon.svg',
  '/images/icon-192.png',
  '/images/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  )
})
