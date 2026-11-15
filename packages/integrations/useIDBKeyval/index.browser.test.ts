import { del, get } from 'idb-keyval'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useIDBKeyval } from './index'

const KEY = 'vueuse-idb-browser-sync-test'
const CHANNEL_NAME = `vueuse-idb-${JSON.stringify(KEY)}`

afterEach(async () => {
  await del(KEY)
})

describe('cross-tab syncing via BroadcastChannel', () => {
  it('isSupported reflects BroadcastChannel availability', () => {
    const { isSupported } = useIDBKeyval(KEY, 'initial')
    expect(isSupported.value).toBe(true)
  })

  it('broadcasts set message when data changes', async () => {
    const { data } = useIDBKeyval(KEY, 'initial')
    await nextTick()

    const received: any[] = []
    const receiver = new BroadcastChannel(CHANNEL_NAME)
    receiver.addEventListener('message', (e: MessageEvent) => received.push(e.data))

    data.value = 'updated'

    await vi.waitFor(() => {
      expect(received).toContainEqual({ type: 'set', value: 'updated' })
    })

    receiver.close()
  })

  it('broadcasts delete message when data is set to null', async () => {
    const { data } = useIDBKeyval<string | null>(KEY, 'initial')
    await nextTick()

    const received: any[] = []
    const receiver = new BroadcastChannel(CHANNEL_NAME)
    receiver.addEventListener('message', (e: MessageEvent) => received.push(e.data))

    data.value = null

    await vi.waitFor(() => {
      expect(received).toContainEqual({ type: 'delete' })
    })

    receiver.close()
  })

  it('updates data when receiving a set message from another tab', async () => {
    const { data } = useIDBKeyval(KEY, 'initial')
    await nextTick()

    const sender = new BroadcastChannel(CHANNEL_NAME)
    sender.postMessage({ type: 'set', value: 'from-other-tab' })

    await vi.waitFor(() => {
      expect(data.value).toBe('from-other-tab')
    })

    sender.close()
  })

  it('resets data to initial value when receiving a delete message from another tab', async () => {
    const { data } = useIDBKeyval(KEY, 'initial')
    await nextTick()

    data.value = 'changed'
    await nextTick()

    const sender = new BroadcastChannel(CHANNEL_NAME)
    sender.postMessage({ type: 'delete' })

    await vi.waitFor(() => {
      expect(data.value).toBe('initial')
    })

    sender.close()
  })

  it('does not write back to IDB or re-broadcast when receiving a message from another tab', async () => {
    const { data } = useIDBKeyval(KEY, 'initial')
    await nextTick()

    const sender = new BroadcastChannel(CHANNEL_NAME)
    sender.postMessage({ type: 'set', value: 'from-other-tab' })

    await vi.waitFor(() => expect(data.value).toBe('from-other-tab'))

    // Give time for any spurious write to settle
    await new Promise(resolve => setTimeout(resolve, 50))

    // IDB should still have 'initial' — the incoming sync must not trigger a write-back
    expect(await get(KEY)).toBe('initial')

    sender.close()
  })

  it('calls onError and keeps watcher active if serializer.read throws on incoming message', async () => {
    const onError = vi.fn()
    const serializer = {
      read: vi.fn(() => { throw new Error('read error') }),
      write: (v: string) => v,
    }

    const { data } = useIDBKeyval<string>(KEY, 'initial', { serializer, onError })
    await nextTick()

    const sender = new BroadcastChannel(CHANNEL_NAME)
    sender.postMessage({ type: 'set', value: 'from-other-tab' })

    await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    expect(data.value).toBe('initial')

    // Watcher should still be active — a local write should still update IDB
    data.value = 'local-update'
    await vi.waitFor(async () => {
      expect(await get(KEY)).toBe('local-update')
    })

    sender.close()
  })

  it('does not sync changes when listenToStorageChanges is false', async () => {
    const { data } = useIDBKeyval(KEY, 'initial', { listenToStorageChanges: false })
    await nextTick()

    const sender = new BroadcastChannel(CHANNEL_NAME)
    sender.postMessage({ type: 'set', value: 'from-other-tab' })

    // Wait long enough for a message to have been delivered if a listener existed
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(data.value).toBe('initial')

    sender.close()
  })
})
