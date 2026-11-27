import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useLocalStorage } from './index'

function createBlockedWindow(error: DOMException): Window {
  return {
    get localStorage(): Storage {
      throw error
    },
    get sessionStorage(): Storage {
      throw error
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as Window
}

describe('useLocalStorage', () => {
  it('reports a blocked storage and keeps the ref usable', async () => {
    const error = new DOMException('The operation is insecure.', 'SecurityError')
    const onError = vi.fn()

    const state = useLocalStorage('blocked', 'initial', {
      window: createBlockedWindow(error),
      onError,
    })

    expect(state.value).toBe('initial')
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(error)

    state.value = 'updated'
    await nextTick()
    expect(state.value).toBe('updated')
  })

  it('uses the provided window storage when it is available', () => {
    const values = new Map<string, string>()
    values.set('key', 'stored')

    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    }

    const state = useLocalStorage('key', 'initial', {
      window: {
        localStorage: storage,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as Window,
      listenToStorageChanges: false,
    })

    expect(state.value).toBe('stored')
  })
})
