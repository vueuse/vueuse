import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { debouncedWatch, watchDebounced } from './index'

describe('watchDebounced', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should export module', () => {
    expect(watchDebounced).toBeDefined()
    expect(debouncedWatch).toBeDefined()
  })

  it('should work by default', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    watchDebounced(num, cb)

    num.value = 1
    await nextTick()
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())
  })

  it('should work when set debounce and maxWait', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    watchDebounced(num, cb, { debounce: 100, maxWait: 150 })

    num.value = 1
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(0)

    num.value = 2
    await vi.advanceTimersByTimeAsync(50)
    expect(cb).toHaveBeenCalledTimes(0)

    await vi.advanceTimersByTimeAsync(50)
    expect(cb).toHaveBeenCalledWith(2, 1, expect.anything())

    num.value = 4
    await vi.advanceTimersByTimeAsync(80)
    expect(cb).toHaveBeenCalledTimes(1)

    num.value = 5
    await vi.advanceTimersByTimeAsync(75)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenCalledWith(5, 4, expect.anything())
  })

  it('should work with constant changes over multiple maxWaits', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()

    const constantUpdateOverTime = async (ms: number) => {
      for (let i = 0; i < ms; i++) {
        num.value += 1
        await vi.advanceTimersByTimeAsync(1)
      }
    }
    watchDebounced(num, cb, { debounce: 10, maxWait: 50 })
    expect(cb).toHaveBeenCalledTimes(0)
    await constantUpdateOverTime(49)
    expect(cb).toHaveBeenCalledTimes(0)
    await constantUpdateOverTime(1)
    expect(cb).toHaveBeenCalledTimes(1)
    await constantUpdateOverTime(50)
    expect(cb).toHaveBeenCalledTimes(2)
    await constantUpdateOverTime(50)

    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb.mock.calls[0][0]).toBe(50)
    expect(cb.mock.calls[1][0]).toBe(100)
    expect(cb.mock.calls[2][0]).toBe(150)
  })

  it('should work with leading: true, trailing: false', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    watchDebounced(num, cb, { debounce: 100, leading: true, trailing: false })

    num.value = 1
    await nextTick()
    // Leading edge fires immediately
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())

    // Subsequent changes within debounce window are ignored
    num.value = 2
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    // No trailing invocation
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should work with leading: true, trailing: true', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    watchDebounced(num, cb, { debounce: 100, leading: true, trailing: true })

    num.value = 1
    await nextTick()
    // Leading edge fires immediately
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())

    // Another change within debounce window
    num.value = 2
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    // Trailing invocation fires with latest value
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenCalledWith(2, 1, expect.anything())
  })

  it('should reset leading edge after debounce expires', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    watchDebounced(num, cb, { debounce: 100, leading: true, trailing: false })

    // First burst
    num.value = 1
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    // Second burst after debounce expired — leading fires again
    num.value = 2
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenCalledWith(2, 1, expect.anything())
  })

  it('should work with leading: false, trailing: false (no invocations)', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    watchDebounced(num, cb, { debounce: 100, leading: false, trailing: false })

    num.value = 1
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(100)
    expect(cb).toHaveBeenCalledTimes(0)
  })

  it('should work with leading and maxWait', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    watchDebounced(num, cb, { debounce: 50, maxWait: 100, leading: true, trailing: true })

    num.value = 1
    await nextTick()
    // Leading fires at t=0
    expect(cb).toHaveBeenCalledTimes(1)

    // Keep changing within debounce window
    vi.advanceTimersByTime(30)
    num.value = 2
    await nextTick()
    vi.advanceTimersByTime(30)
    num.value = 3
    await nextTick()
    vi.advanceTimersByTime(30)
    num.value = 4
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(1)

    // maxWait triggers at t=100
    vi.advanceTimersByTime(10)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
