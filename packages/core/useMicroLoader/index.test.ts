import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useMicroLoader } from './index'

describe('useMicroLoader', () => {
  let systemTime: Date
  beforeEach(() => {
    vi.useFakeTimers()
    systemTime = new Date('2025-01-01')
    vi.setSystemTime(systemTime)
  })

  function advanceSystemTime(ms: number) {
    systemTime = new Date(systemTime.getTime() + ms)
    vi.setSystemTime(systemTime)
  }

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not show micro loading for quick operations', async () => {
    const isLoadingRef = shallowRef(false)
    const isMicroLoadingRef = useMicroLoader(isLoadingRef, {
      minLoadingTimeMs: 10_000,
      quickLoadingThresholdMs: 5_000,
    })

    // Start loading
    isLoadingRef.value = true
    await nextTick()

    // Advance time just before the quick loading threshold
    vi.advanceTimersByTime(1000)
    advanceSystemTime(1000)

    // Micro loading should not be shown yet
    expect(isMicroLoadingRef.value).toBe(false)

    // End loading before the quick loading threshold
    isLoadingRef.value = false
    await nextTick()

    vi.advanceTimersByTime(1000)
    advanceSystemTime(1000)

    // Micro loading should remain false
    expect(isMicroLoadingRef.value).toBe(false)
  })

  it('should show micro loading for slow operations', async () => {
    const isLoadingRef = shallowRef(false)
    const isMicroLoadingRef = useMicroLoader(isLoadingRef, {
      minLoadingTimeMs: 10_000,
      quickLoadingThresholdMs: 5_000,
    })

    // Start loading
    isLoadingRef.value = true
    await nextTick()

    // Advance time past the quick loading threshold
    vi.advanceTimersByTime(5001)
    advanceSystemTime(5001)
    // Micro loading should be shown
    expect(isMicroLoadingRef.value).toBe(true)

    // End loading
    isLoadingRef.value = false
    await nextTick()

    // Micro loading should remain true for the minimum loading time
    expect(isMicroLoadingRef.value).toBe(true)

    // Advance time to just before the minimum loading time
    vi.advanceTimersByTime(4998)
    advanceSystemTime(4998)

    // Micro loading should still be true
    expect(isMicroLoadingRef.value).toBe(true)

    // Advance time past the minimum loading time
    vi.advanceTimersByTime(1)
    advanceSystemTime(1)

    // Micro loading should now be false
    expect(isMicroLoadingRef.value).toBe(false)
  })

  it('should handle multiple loading cycles correctly', async () => {
    const isLoadingRef = shallowRef(false)
    const isMicroLoadingRef = useMicroLoader(isLoadingRef, {
      minLoadingTimeMs: 10_000,
      quickLoadingThresholdMs: 5_000,
    })

    // First loading cycle - quick
    isLoadingRef.value = true
    await nextTick()

    vi.advanceTimersByTime(4999)
    advanceSystemTime(4999)

    isLoadingRef.value = false
    await nextTick()

    expect(isMicroLoadingRef.value).toBe(false)

    // Second loading cycle - slow
    isLoadingRef.value = true
    await nextTick()

    vi.advanceTimersByTime(5001)
    advanceSystemTime(5001)

    expect(isMicroLoadingRef.value).toBe(true)
    isLoadingRef.value = false
    await nextTick()

    // Micro loading should remain true for the minimum loading time
    expect(isMicroLoadingRef.value).toBe(true)
    vi.advanceTimersByTime(4998)
    advanceSystemTime(4998)
    expect(isMicroLoadingRef.value).toBe(true)

    vi.advanceTimersByTime(1)
    advanceSystemTime(1)

    expect(isMicroLoadingRef.value).toBe(false)

    // Third loading cycle - quick again
    isLoadingRef.value = true
    await nextTick()

    vi.advanceTimersByTime(4999)
    advanceSystemTime(4999)
    isLoadingRef.value = false
    await nextTick()

    expect(isMicroLoadingRef.value).toBe(false)
  })

  it('should handle rapid toggling of loading state', () => {
    const isLoadingRef = shallowRef(false)
    const isMicroLoadingRef = useMicroLoader(isLoadingRef, {
      minLoadingTimeMs: 10_000,
      quickLoadingThresholdMs: 5_000,
    })

    // Rapidly toggle loading state
    for (let i = 0; i < 5; i++) {
      isLoadingRef.value = true
      vi.advanceTimersByTime(2500)
      advanceSystemTime(2500)
      isLoadingRef.value = false
      vi.advanceTimersByTime(2500)
      advanceSystemTime(2500)
    }

    // Micro loading should not be shown for these quick operations
    expect(isMicroLoadingRef.value).toBe(false)
  })

  it('should handle loading state changes while micro loading is active', async () => {
    const isLoadingRef = shallowRef(false)
    const isMicroLoadingRef = useMicroLoader(isLoadingRef, {
      minLoadingTimeMs: 10_000,
      quickLoadingThresholdMs: 5_000,
    })

    // Start loading
    isLoadingRef.value = true
    await nextTick()

    // Advance time past the quick loading threshold
    vi.advanceTimersByTime(5001)
    advanceSystemTime(5001)
    // Micro loading should be shown
    expect(isMicroLoadingRef.value).toBe(true)

    // Change loading state while micro loading is active
    isLoadingRef.value = false
    await nextTick()
    // Micro loading should remain true for the minimum loading time
    expect(isMicroLoadingRef.value).toBe(true)

    // Advance time past the minimum loading time
    vi.advanceTimersByTime(10000)
    advanceSystemTime(10000)
    // Micro loading should now be false
    expect(isMicroLoadingRef.value).toBe(false)
  })
})
