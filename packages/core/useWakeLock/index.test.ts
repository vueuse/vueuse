import type { WakeLockSentinel } from './index'
import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { useWakeLock } from './index'

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

  it('should automatically release wake lock on scope dispose', async () => {
    const sentinel = defineWakeLockAPI()
    const mockDocument = new MockDocument()
    mockDocument.visibilityState = 'visible'

    const scope = effectScope()
    let wakeLock: ReturnType<typeof useWakeLock> | null = null

    await scope.run(async () => {
      wakeLock = useWakeLock({ document: mockDocument as Document })
      await wakeLock!.request('screen')
    })

    // Verify wake lock is active before dispose
    expect(wakeLock!.isActive.value).toBeTruthy()
    expect(wakeLock!.sentinel.value).toBeTruthy()
    expect(sentinel.released).toBeFalsy()

    // Dispose the scope (simulating component unmount)
    // This should trigger tryOnScopeDispose which calls release()
    scope.stop()
    await nextTick()

    // Verify wake lock was automatically released
    expect(wakeLock!.sentinel.value).toBeNull()
    expect(sentinel.released).toBeTruthy()
    expect(wakeLock!.isActive.value).toBeFalsy()
  })

  it('should not release wake lock if scope is not disposed', async () => {
    const sentinel = defineWakeLockAPI()
    const mockDocument = new MockDocument()
    mockDocument.visibilityState = 'visible'

    const scope = effectScope()
    let wakeLock: ReturnType<typeof useWakeLock> | null = null

    await scope.run(async () => {
      wakeLock = useWakeLock({ document: mockDocument as Document })
      await wakeLock!.request('screen')
    })

    // Verify wake lock is active
    expect(wakeLock!.isActive.value).toBeTruthy()
    expect(wakeLock!.sentinel.value).toBeTruthy()
    expect(sentinel.released).toBeFalsy()

    // Don't dispose scope - wake lock should remain active
    await nextTick()

    expect(wakeLock!.sentinel.value).toBeTruthy()
    expect(sentinel.released).toBeFalsy()
    expect(wakeLock!.isActive.value).toBeTruthy()

    // Cleanup
    scope.stop()
  })
})
