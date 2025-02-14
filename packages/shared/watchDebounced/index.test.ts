import { describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { debouncedWatch, watchDebounced } from './index'

describe('watchDebounced', () => {
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
    vi.useFakeTimers()
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
    vi.useFakeTimers()
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
})
