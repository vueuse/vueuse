import type { Awaitable, StorageLikeAsync } from '@vueuse/core'
import { createEventHook, useStorageAsync } from '@vueuse/core'
import { beforeEach, describe, expect, it } from 'vitest'

const KEY = 'custom-key'
const asyncDelay = 10

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

  it('onReady', () => {
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
        onLoad(value) {
          loaded.trigger(value)
        },
      },
    )

    expect(storage.value).toBe('')
    expect(promise).resolves.toBe('CurrentValue')
  })
})
