import type { Ref } from 'vue'
import { get, set } from 'idb-keyval'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useIDBKeyval } from './index'

const cache = new Map<string, unknown>()

// --- BroadcastChannel mock ---
const mockChannels = new Map<string, MockBroadcastChannel>()

class MockBroadcastChannel {
  name: string
  postMessage = vi.fn()
  close = vi.fn()
  private listeners = new Map<string, ((event: any) => void)[]>()

  constructor(name: string) {
    this.name = name
    mockChannels.set(name, this)
  }

  addEventListener(type: string, listener: (event: any) => void) {
    if (!this.listeners.has(type))
      this.listeners.set(type, [])
    this.listeners.get(type)!.push(listener)
  }

  simulateMessage(data: any) {
    for (const listener of this.listeners.get('message') ?? [])
      listener({ data })
  }
}

vi.stubGlobal('BroadcastChannel', MockBroadcastChannel)

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

  describe('cross-tab syncing', () => {
    const KEY5 = 'vue-use-idb-keyval-5'
    const channelName = `vueuse-idb-${JSON.stringify(KEY5)}`

    beforeEach(() => {
      mockChannels.clear()
    })

    it('creates a BroadcastChannel by default', async () => {
      useIDBKeyval(KEY5, 'initial')

      expect(mockChannels.has(channelName)).toBe(true)
    })

    it('does not create a BroadcastChannel when listenToStorageChanges is false', () => {
      useIDBKeyval(KEY5, 'initial', { listenToStorageChanges: false })

      expect(mockChannels.has(channelName)).toBe(false)
    })

    it('broadcasts set message when data changes', async () => {
      const { data } = useIDBKeyval(KEY5, 'initial')
      await nextTick()

      const channel = mockChannels.get(channelName)!
      channel.postMessage.mockClear()

      data.value = 'updated'
      await nextTick()

      expect(channel.postMessage).toHaveBeenCalledWith({ type: 'set', value: 'updated' })
    })

    it('broadcasts delete message when data is set to null', async () => {
      const { data } = useIDBKeyval<string | null>(KEY5, 'initial')
      await nextTick()

      const channel = mockChannels.get(channelName)!
      channel.postMessage.mockClear()

      data.value = null
      await nextTick()

      expect(channel.postMessage).toHaveBeenCalledWith({ type: 'delete' })
    })

    it('updates data when receiving a set message from another tab', async () => {
      const { data } = useIDBKeyval(KEY5, 'initial')
      await nextTick()

      mockChannels.get(channelName)!.simulateMessage({ type: 'set', value: 'from-other-tab' })

      expect(data.value).toBe('from-other-tab')
    })

    it('resets data to initial value when receiving a delete message from another tab', async () => {
      const { data } = useIDBKeyval(KEY5, 'initial')
      await nextTick()

      mockChannels.get(channelName)!.simulateMessage({ type: 'delete' })

      expect(data.value).toBe('initial')
    })

    it('calls onError and keeps watcher active if serializer.read throws on incoming message', async () => {
      const onError = vi.fn()
      const serializer = {
        read: vi.fn(() => { throw new Error('read error') }),
        write: (v: string) => v,
      }
      const { data } = useIDBKeyval<string>(KEY5, 'initial', { serializer, onError })
      await nextTick()

      const channel = mockChannels.get(channelName)!
      channel.simulateMessage({ type: 'set', value: 'from-other-tab' })
      await nextTick()

      expect(onError).toHaveBeenCalledTimes(1)
      expect(data.value).toBe('initial')

      // watcher should still be active — a subsequent local write should broadcast
      channel.postMessage.mockClear()
      data.value = 'local-update'
      await nextTick()
      expect(channel.postMessage).toHaveBeenCalledWith({ type: 'set', value: 'local-update' })
    })

    it('does not write back to IDB or re-broadcast when receiving a message from another tab', async () => {
      const { data } = useIDBKeyval(KEY5, 'initial')
      await nextTick()

      const channel = mockChannels.get(channelName)!
      channel.postMessage.mockClear()
      const idbValueBefore = cache.get(KEY5)

      channel.simulateMessage({ type: 'set', value: 'from-other-tab' })
      await nextTick()

      expect(data.value).toBe('from-other-tab')
      expect(cache.get(KEY5)).toBe(idbValueBefore)
      expect(channel.postMessage).not.toHaveBeenCalled()
    })
  })
})
