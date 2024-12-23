import type { WakeLockSentinel } from '.'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useWakeLock } from '.'

class MockWakeLockSentinel extends EventTarget {
  released = false
  release() {
    this.released = true
    return Promise.resolve()
  }
}
function defineWakeLockAPI() {
  const sentinel = new MockWakeLockSentinel()
  Object.defineProperty(navigator, 'wakeLock', {
    value: { request: async () => sentinel as WakeLockSentinel },
    writable: true,
  })
  return sentinel
}

class MockDocument extends EventTarget {
  visibilityState = 'hidden'
}

describe('useWakeLock', () => {
  it('isActive not changed if not supported', async () => {
    const { isActive, request, release } = useWakeLock({ navigator: {} as Navigator })

    expect(isActive.value).toBeFalsy()

    await request('screen')

    expect(isActive.value).toBeFalsy()

    await release()

    expect(isActive.value).toBeFalsy()
  })

  it('isActive changed if supported', async () => {
    defineWakeLockAPI()

    const { isActive, forceRequest, release } = useWakeLock()

    expect(isActive.value).toBeFalsy()

    await forceRequest('screen')

    expect(isActive.value).toBeTruthy()

    await release()

    expect(isActive.value).toBeFalsy()
  })

  it('isActive changed if show other tabs or minimize window', async () => {
    vi.useFakeTimers()
    defineWakeLockAPI()

    const { isActive, request } = useWakeLock()

    expect(isActive.value).toBeFalsy()

    await request('screen')
    await vi.advanceTimersByTimeAsync(10)

    expect(isActive.value).toBeTruthy()

    document.dispatchEvent(new window.Event('visibilitychange'))

    await nextTick()

    expect(isActive.value).toBeTruthy()
  })

  it('it should delay requesting if document is hidden', async () => {
    defineWakeLockAPI()
    const mockDocument = new MockDocument()

    const { isActive, request } = useWakeLock({ document: mockDocument as Document })

    await request('screen')

    expect(isActive.value).toBeFalsy()

    mockDocument.visibilityState = 'visible'
    mockDocument.dispatchEvent(new Event('visibilitychange'))

    await nextTick()
    await nextTick()

    expect(isActive.value).toBeTruthy()
  })

  it('it should cancel requesting if released is called before document become visible', async () => {
    defineWakeLockAPI()
    const mockDocument = new MockDocument()

    const { isActive, request, release } = useWakeLock({ document: mockDocument as Document })

    await request('screen')

    expect(isActive.value).toBeFalsy()

    await release()

    expect(isActive.value).toBeFalsy()

    mockDocument.visibilityState = 'visible'
    mockDocument.dispatchEvent(new Event('visibilitychange'))

    await nextTick()
    await nextTick()

    expect(isActive.value).toBeFalsy()
  })

  it('it should be inactive if wake lock is released for some reasons', async () => {
    const sentinel = defineWakeLockAPI()
    const mockDocument = new MockDocument()
    mockDocument.visibilityState = 'visible'

    const { isActive, request } = useWakeLock({ document: mockDocument as Document })

    await request('screen')

    expect(isActive.value).toBeTruthy()

    mockDocument.visibilityState = 'hidden'
    mockDocument.dispatchEvent(new Event('visibilitychange'))
    sentinel.dispatchEvent(new Event('release'))

    await nextTick()
    await nextTick()

    expect(isActive.value).toBeFalsy()

    mockDocument.visibilityState = 'visible'
    mockDocument.dispatchEvent(new Event('visibilitychange'))
    await request('screen')

    await nextTick()
    await nextTick()

    expect(isActive.value).toBeTruthy()
  })
})
