import nodeFetch from 'node-fetch'

// @ts-expect-error polyfill
window.fetch = nodeFetch

export {}
