import { ref } from 'vue-demi'
import { describe, expect, it, vi } from 'vitest'
import { promiseTimeout } from '../utils'
import { useTimeoutFn } from '.'

describe('useTimeoutFn', () => {
  it('supports reactive intervals', async () => {
    const callback = vi.fn()
    const interval = ref(0)
    const { start } = useTimeoutFn(callback, interval)

    start()
    await promiseTimeout(1)
    expect(callback).toBeCalled()

    callback.mockReset()
    interval.value = 50

    start()
    await promiseTimeout(1)
    expect(callback).not.toBeCalled()
    await promiseTimeout(100)
    expect(callback).toBeCalled()
  })

  it('supports getting pending status', async () => {
    const callback = vi.fn()
    const { start, isPending } = useTimeoutFn(callback, 0, { immediate: false })

    expect(isPending.value).toBe(false)
    expect(callback).not.toBeCalled()

    start()

    expect(isPending.value).toBe(true)
    expect(callback).not.toBeCalled()

    await promiseTimeout(1)

    expect(isPending.value).toBe(false)
    expect(callback).toBeCalled()
  })

  it('supports pausing timer', async () => {
    vi.useFakeTimers()

    const callback = vi.fn()
    const { pause, resume, isActive, timeLeft } = useTimeoutFn(callback, 50)

    vi.advanceTimersByTime(20)
    pause()
    expect(isActive, 'Timer should not be active')
    expect(timeLeft.value, 'Time left should be the original timeout minus time passed').toBe(30)

    vi.advanceTimersByTime(31)
    expect(timeLeft.value, 'Time left should be the same after some more time has passed').toBe(30)
    expect(callback).not.toBeCalled()

    resume()
    expect(isActive.value, 'Timer should be active again').toBe(true)
    vi.advanceTimersByTime(31)
    expect(callback).toBeCalled()

    vi.useRealTimers()
  })
})
