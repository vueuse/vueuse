import type { Awaitable, StorageLikeAsync } from '@vueuse/core'
import { createEventHook, useStorageAsync } from '@vueuse/core'
import { beforeEach, describe, expect, it } from 'vitest'

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
    await expect(promise).resolves.toBe('CurrentValue')
  })

  it('onReadyByPromise', async () => {
    localStorage.setItem(KEY2, 'AnotherValue')

    const storage = useStorageAsync(
      KEY2,
      '',
      new AsyncStubStorage(),
    )

    expect(storage.value).toBe('')

    storage.then((result) => {
      expect(result.value).toBe('AnotherValue')
    })
  })
})
