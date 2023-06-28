import nodeFetch from 'node-fetch'

// @ts-expect-error remove XMLHttpRequest from global scope to prevent it from being used in tests
globalThis.XMLHttpRequest = undefined

// @ts-expect-error override
globalThis.fetch = nodeFetch

export {}
