// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />
// eslint-disable-next-line spaced-comment
/// <reference lib="webworker" />

import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { NetworkFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

const entries = self.__WB_MANIFEST

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(entries)

// clean old assets
cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

if (import.meta.env.PROD) {
  const swPath = self.location.pathname.lastIndexOf('/')
  const base = swPath === 0 ? '/' : self.location.pathname.slice(0, swPath + 1)
  function escapeStringRegexp(value: string) {
    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return value
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d')
  }
  allowlist = entries.filter((page) => {
    return typeof page === 'string'
      ? page.endsWith('.html')
      : page.url.endsWith('.html')
  }).map((page) => {
    const url = typeof page === 'string' ? page : page.url
    const regex = url === 'index.html'
      ? escapeStringRegexp(base)
      : escapeStringRegexp(`${base}${url.replace(/\.html$/, '')}`)
    return new RegExp(`^${regex}(\\.html)?$`)
  })
  registerRoute(
    ({ request, sameOrigin }) => {
      return sameOrigin && request.mode === 'navigate'
    },
    new NetworkOnly({
      plugins: [{
        /* this callback will be called when the fetch call fails */
        handlerDidError: async () => Response.redirect('404', 302),
        /* this callback will prevent caching the response */
        cacheWillUpdate: async () => null,
      }],
    }),
    'GET',
  )
  // googleapis
  registerRoute(
    /^https:\/\/fonts\.googleapis\.com\/.*/i,
    new NetworkFirst({
      cacheName: 'google-fonts-cache',
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        // we only need a few entries
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
        }),
      ],
    }),
  )
  // gstatic
  registerRoute(
    /^https:\/\/fonts\.gstatic\.com\/.*/i,
    new StaleWhileRevalidate({
      cacheName: 'google-fonts-cache',
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        // we only need a few entries
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
        }),
      ],
    }),
  )
  // antfu sponsors
  registerRoute(
    /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
    new NetworkFirst({
      cacheName: 'jsdelivr-images-cache',
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        // we only need a few entries
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 7, // <== 7 days
        }),
      ],
    }),
  )
}

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

// Skip-Waiting Service Worker-based solution
self.addEventListener('activate', async () => {
  // after we've taken over, iterate over all the current clients (windows)
  const clients = await self.clients.matchAll({ type: 'window' })
  clients.forEach((client) => {
    // ...and refresh each one of them
    client.navigate(client.url)
  })
})

self.skipWaiting()
