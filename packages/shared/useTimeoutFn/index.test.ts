import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useTimeoutFn } from './index'

describe('useTimeoutFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('basic start/stop', async () => {
    const callback = vi.fn()
    const interval = shallowRef(0)
    const { start } = useTimeoutFn(callback, interval)

    vi.advanceTimersByTime(1)
    expect(callback).toBeCalled()

    callback.mockReset()
    interval.value = 50

    start()
    vi.advanceTimersByTime(1)
    expect(callback).not.toBeCalled()
    vi.advanceTimersByTime(100)
    expect(callback).toBeCalled()
  })

  it('stop/start with immediateCallback', async () => {
    const callback = vi.fn()
    useTimeoutFn(callback, 50, { immediateCallback: true })

    expect(callback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('supports getting pending status', async () => {
    const callback = vi.fn()
    const { start, isPending } = useTimeoutFn(callback, 0, { immediate: false })

    expect(isPending.value).toBe(false)
    expect(callback).not.toBeCalled()

    start()

    expect(isPending.value).toBe(true)
    expect(callback).not.toBeCalled()

    vi.advanceTimersByTime(1)

    expect(isPending.value).toBe(false)
    expect(callback).toBeCalled()
  })
})
