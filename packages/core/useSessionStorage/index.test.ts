import { describe, expect, it, vi } from 'vitest'
import { useSessionStorage } from './index'

function createBlockedWindow(error: DOMException): Window {
  return {
    get localStorage(): Storage {
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      } as unknown as Storage
    },
    get sessionStorage(): Storage {
      throw error
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as Window
}

describe('useSessionStorage', () => {
  it('reports a blocked storage instead of falling back to localStorage', () => {
    const error = new DOMException('The operation is insecure.', 'SecurityError')
    const onError = vi.fn()

    const state = useSessionStorage('blocked', 'initial', {
      window: createBlockedWindow(error),
      onError,
    })

    expect(state.value).toBe('initial')
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(error)
  })
})
