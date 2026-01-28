import { throttleFilter } from '@vueuse/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useResizeObserver } from './index'

describe('useResizeObserver', () => {
  let mockObserverCallback: ResizeObserverCallback
  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()

    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        mockObserverCallback = callback
      }

      observe = mockObserve
      disconnect = mockDisconnect
      unobserve = vi.fn()
    }

    vi.stubGlobal('ResizeObserver', MockResizeObserver)
  })

  it('should support throttleFilter', async () => {
    vi.useFakeTimers()

    const el = document.createElement('div')
    const callback = vi.fn()

    useResizeObserver(el, callback, {
      eventFilter: throttleFilter(100),
    })

    const entries = [{ target: el, contentRect: { width: 100, height: 100 } }] as unknown as ResizeObserverEntry[]

    // First call should execute immediately (leading edge)
    mockObserverCallback(entries, {} as ResizeObserver)
    expect(callback).toHaveBeenCalledTimes(1)

    // Rapid calls within throttle window should be throttled
    mockObserverCallback(entries, {} as ResizeObserver)
    mockObserverCallback(entries, {} as ResizeObserver)
    mockObserverCallback(entries, {} as ResizeObserver)
    expect(callback).toHaveBeenCalledTimes(1)

    // After throttle period, trailing call should execute
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})
