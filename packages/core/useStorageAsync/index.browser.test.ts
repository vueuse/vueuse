import type { Awaitable, StorageLikeAsync } from '@vueuse/core'
import { createEventHook, useStorageAsync } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isRef } from 'vue'

const KEY = 'custom-key'
const KEY2 = 'custom-key2'
const asyncDelay = 10
const localStorage = globalThis.localStorage

class AsyncStubStorage implements StorageLikeAsync {
  getItem(key: string): Awaitable<string | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localStorage.getItem(key))
      }, asyncDelay)
    })
  }

  removeItem(key: string): Awaitable<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(key)
        resolve()
      }, asyncDelay)
    })
  }

  setItem(key: string, value: string): Awaitable<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, value)
        resolve()
      }, asyncDelay)
    })
  }
}

describe('useStorageAsync', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('onReady', async () => {
    localStorage.setItem(KEY, 'CurrentValue')

    const loaded = createEventHook()
    const promise = new Promise<string>((resolve) => {
      loaded.on(resolve)
    })

    const storage = useStorageAsync(
      KEY,
      '',
      new AsyncStubStorage(),
      {
        onReady(value) {
          loaded.trigger(value)
        },
      },
    )

    expect(storage.value).toBe('')
    await vi.waitFor(async () => {
      await expect(promise).resolves.toBe('CurrentValue')
    })
  })

  it('onReadyByPromise', async () => {
    localStorage.setItem(KEY2, 'AnotherValue')

    const storage = useStorageAsync(
      KEY2,
      '',
      new AsyncStubStorage(),
    )

    expect(storage.value).toBe('')

    await vi.waitFor(async () => {
      const result = await storage
      expect(result.value).toBe('AnotherValue')
    })
  })

  // https://github.com/vueuse/vueuse/issues/5195
  it('resolves the promise with the storage ref', async () => {
    localStorage.setItem(KEY2, 'AnotherValue')

    const storage = useStorageAsync(
      KEY2,
      '',
      new AsyncStubStorage(),
    )

    const settled = Promise.race([
      Promise.resolve(storage).then(() => 'settled'),
      new Promise<string>(resolve => setTimeout(resolve, 1000, 'timed out')),
    ])

    await vi.advanceTimersByTimeAsync(1000)

    expect(await settled).toBe('settled')

    const result = await storage
    expect(isRef(result)).toBe(true)
    expect(result.value).toBe('AnotherValue')

    // stays awaitable once it has already resolved
    expect(await storage).toBe(result)

    // writes through the returned ref reach the resolved ref and the storage
    storage.value = 'UpdatedValue'
    expect(result.value).toBe('UpdatedValue')

    await vi.advanceTimersByTimeAsync(1000)
    expect(localStorage.getItem(KEY2)).toBe('UpdatedValue')
  })
})
