import './polyfillPointerEvents'
import './mockServer'

// Node.js 25+ introduces an incomplete global localStorage object
// (exists but missing clear/getItem/setItem methods).
// This breaks jsdom's localStorage simulation.
// We provide a complete mock here for compatibility.
if (
  typeof localStorage !== 'undefined'
  && typeof localStorage.clear !== 'function'
) {
  const storageState = new Map<string, string>()
  const storageMock: Storage = {
    getItem: (key: string) => storageState.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storageState.set(key, value)
    },
    removeItem: (key: string) => {
      storageState.delete(key)
    },
    clear: () => {
      storageState.clear()
    },
    get length() {
      return storageState.size
    },
    key: (index: number) => Array.from(storageState.keys())[index] ?? null,
  }

  globalThis.localStorage = storageMock
}
