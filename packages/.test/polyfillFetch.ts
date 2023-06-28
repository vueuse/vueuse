import { AbortController, fetch } from 'node-fetch-native'

globalThis.AbortController = AbortController
window.AbortController = AbortController
window.fetch = fetch

export {}
