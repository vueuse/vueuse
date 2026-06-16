import type { Awaitable, StorageLikeAsync } from '@vueuse/core'
import { mount } from '@vue/test-utils'
import { createEventHook, useStorageAsync } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'

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
    vi.waitFor(async () => {
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

    vi.waitFor(async () => {
      const result = await storage
      expect(result.value).toBe('AnotherValue')
    })
  })

  it('initOnMounted', async () => {
    localStorage.setItem(KEY, 'random')

    let basicRef: ReturnType<typeof useStorageAsync<string>> | undefined

    mount(defineComponent({
      setup() {
        basicRef = useStorageAsync(KEY, '', new AsyncStubStorage(), { initOnMounted: true })
        // Pre-mount, the ref still holds the default value because the
        // initial read is deferred until the component is mounted.
        expect(basicRef.value).toBe('')
        return {}
      },
      render() {
        return null
      },
    }))

    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()

    expect(basicRef!.value).toBe('random')
  })
})
