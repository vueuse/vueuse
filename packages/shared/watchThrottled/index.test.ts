import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { throttledWatch, watchThrottled } from '.'

describe('watchThrottled', () => {
  it('should export module', () => {
    expect(watchThrottled).toBeDefined()
    expect(throttledWatch).toBeDefined()
  })

  it('should work', async () => {
    vi.useFakeTimers()
    const num = ref(0)
    const cb = vi.fn()
    watchThrottled(num, cb, { throttle: 100 })

    num.value = 1
    await nextTick()
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())

    num.value = 2
    await vi.advanceTimersByTimeAsync(50)
    expect(cb).toHaveBeenCalledTimes(1)

    num.value = 3
    await vi.advanceTimersByTimeAsync(50)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenCalledWith(3, 2, expect.anything())

    num.value = 4
    await vi.advanceTimersByTimeAsync(110)
    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb).toHaveBeenCalledWith(4, 3, expect.anything())
  })
})
