import type { Awaitable, StorageLikeAsync } from '@vueuse/core'
import { createEventHook, useStorageAsync } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, toRaw } from 'vue'
import { useSetup } from '../../.test'

const KEY = 'custom-key'
const KEY2 = 'custom-key2'
const asyncDelay = 10
const localStorage = globalThis.localStorage

interface RawStorageValue {
  name: string
  createdAt: Date
  nested: {
    map: Map<string, Set<number>>
  }
  self?: RawStorageValue
}

function createRawStorageValue(name: string): RawStorageValue {
  const value: RawStorageValue = {
    name,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    nested: {
      map: new Map([
        ['numbers', new Set([1, 2, 3])],
      ]),
    },
  }

  value.self = value

  return value
}

async function flushPromises() {
  await Promise.resolve()
  await Promise.resolve()
}

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

class AsyncRawStorage<T = unknown> implements StorageLikeAsync<T> {
  values = new Map<string, T>()

  constructor(values: [string, T][] = []) {
    this.values = new Map(values)
  }

  getItem(key: string): Awaitable<T | null> {
    return this.values.get(key) ?? null
  }

  removeItem(key: string): Awaitable<void> {
    this.values.delete(key)
  }

  setItem(key: string, value: T): Awaitable<void> {
    this.values.set(key, value)
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
    await vi.advanceTimersByTimeAsync(asyncDelay)
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

    await vi.advanceTimersByTimeAsync(asyncDelay)
    let result
    storage.then((value) => {
      result = value
    })
    await flushPromises()

    expect(result).toHaveProperty('value', 'AnotherValue')
  })

  it('stores values as-is when serializer is false', async () => {
    const storage = new AsyncRawStorage<RawStorageValue>()
    const initial = createRawStorageValue('initial')
    const state = useStorageAsync(KEY, initial, storage, { serializer: false })
    await flushPromises()

    expect(toRaw(state.value)).toBe(initial)
    expect(storage.values.get(KEY)).toBe(initial)

    const next = createRawStorageValue('next')
    state.value = next
    await nextTick()
    await flushPromises()

    const storedValue = storage.values.get(KEY)
    expect(storedValue).toBe(state.value)
    expect(toRaw(storedValue!)).toBe(next)
  })

  it('stores vm values as-is when serializer is false', async () => {
    const storage = new AsyncRawStorage<RawStorageValue>()
    const initial = createRawStorageValue('initial')
    const vm = useSetup(() => {
      const state = useStorageAsync(KEY, initial, storage, { serializer: false })

      return {
        state,
      }
    })
    await flushPromises()

    expect(toRaw(vm.state)).toBe(initial)
    expect(storage.values.get(KEY)).toBe(initial)

    const next = createRawStorageValue('next')
    vm.state = next
    await nextTick()
    await flushPromises()

    const storedValue = storage.values.get(KEY)
    expect(storedValue).toBe(vm.state)
    expect(toRaw(storedValue!)).toBe(next)
  })

  it('reads existing values as-is when serializer is false', async () => {
    const storedValue = createRawStorageValue('stored')
    const storage = new AsyncRawStorage([[KEY, storedValue]])
    const state = useStorageAsync(KEY, createRawStorageValue('default'), storage, { serializer: false })
    await flushPromises()

    expect(toRaw(state.value)).toBe(storedValue)
    expect(storage.values.get(KEY)).toBe(storedValue)
  })
})
