import type { Ref } from 'vue'
import { get, set } from 'idb-keyval'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useIDBKeyval } from './index'

const cache = new Map<string, unknown>()

vi.mock('idb-keyval', () => ({
  get: (key: string) => Promise.resolve(cache.get(key)),
  set: vi.fn((key: string, value: any) => new Promise((resolve, reject) => {
    if (value === 'error') {
      reject(new Error('set error'))
      return
    }

    cache.set(key, value)

    resolve(undefined)
  })),
  update: (key: string, updater: () => any) => new Promise((resolve, reject) => {
    const value = updater()
    if (value === 'error') {
      reject(new Error('update error'))
      return
    }

    cache.set(key, value)

    resolve(undefined)
  }),
  del: (key: string) => {
    cache.delete(key)
  },
}))

const KEY1 = 'vue-use-idb-keyval-1'
const KEY2 = 'vue-use-idb-keyval-2'
const KEY3 = 'vue-use-idb-keyval-3'
const KEY4 = 'vue-use-idb-keyval-4'

describe('useIDBKeyval', () => {
  let data1: Ref<{ count: number } | null>
  let data2: Ref<string[] | null>
  let data3: Ref<string | null>

  beforeEach(async () => {
    console.error = vi.fn()

    await set(KEY3, 'hello');

    ({ data: data1 } = useIDBKeyval(KEY1, { count: 0 }));
    ({ data: data2 } = useIDBKeyval(KEY2, ['foo', 'bar']));
    ({ data: data3 } = useIDBKeyval(KEY3, 'world', { shallow: true }))
  })

  afterEach(() => {
    vi.clearAllMocks()
    cache.clear()
  })

  it('get/set', async () => {
    expect(data1.value).toEqual({ count: 0 })
    expect(data2.value).toEqual(['foo', 'bar'])
    expect(data3.value).toEqual('hello')

    expect(await get(KEY1)).toEqual(data1.value)
    expect(await get(KEY2)).toEqual(data2.value)
    expect(await get(KEY3)).toEqual(data3.value)
  })

  it('update', async () => {
    data1.value!.count++
    data2.value!.push('woo')
    data3.value = 'world'

    expect(await get(KEY1)).toEqual(data1.value)
    expect(await get(KEY2)).toEqual(data2.value)
    expect(await get(KEY3)).toEqual(data3.value)
  })

  it('del', async () => {
    data1.value = null
    data2.value = null
    data3.value = null

    await nextTick()

    expect(await get(KEY1)).toBeUndefined()
    expect(await get(KEY2)).toBeUndefined()
    expect(await get(KEY3)).toBeUndefined()
  })

  it('catch error on update error', async () => {
    data3.value = 'error'

    await nextTick()

    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it('catch error on init error', async () => {
    useIDBKeyval('ERROR_KEY', 'error')

    await nextTick()
    await nextTick()

    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it ('isFinished', async () => {
    const { isFinished } = useIDBKeyval(KEY4, 'test')
    expect(isFinished.value).toBe(false)

    await nextTick()
    await nextTick()

    expect(isFinished.value).toBe(true)
  })

  it('writeDefaults false', async () => {
    useIDBKeyval(KEY4, 'test', { writeDefaults: false })

    // the initial 3 IDB calls minus this one
    expect(set).toHaveBeenCalledTimes(3)
  })

  it('get/set with serializer', async () => {
    const serializer = {
      read(raw: unknown): string {
        return raw === 1 ? 'foo' : 'bar'
      },
      write(value: string): unknown {
        return value === 'foo' ? 1 : 0
      },
    }

    const { data } = useIDBKeyval(KEY4, 'foo', { serializer })

    await nextTick()

    expect(data.value).toEqual('foo')
    expect(await get(KEY4)).toEqual(1)
  })

  it('get/set with serializer and existing value', async () => {
    const serializer = {
      read(raw: unknown): string {
        return raw === 1 ? 'foo' : 'bar'
      },
      write(value: string): unknown {
        return value === 'foo' ? 1 : 0
      },
    }

    await set(KEY4, 0)

    const { data } = useIDBKeyval(KEY4, 'foo', { serializer })

    await nextTick()

    expect(data.value).toEqual('bar')
    expect(await get(KEY4)).toEqual(0)
  })
})
