import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useTimeoutFn } from './index'

describe('useTimeoutFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  it('passes start arguments to both immediate and delayed callbacks', () => {
    const callback = vi.fn((value: { message: string }) => value.message)
    const { start, stop } = useTimeoutFn(callback, 50, {
      immediate: false,
      immediateCallback: true,
    })
    const first = { message: 'first' }
    const second = { message: 'second' }

    start(first)
    expect(callback).toHaveBeenNthCalledWith(1, first)
    vi.advanceTimersByTime(50)
    expect(callback).toHaveBeenNthCalledWith(2, first)

    start(second)
    expect(callback).toHaveBeenNthCalledWith(3, second)
    vi.advanceTimersByTime(50)
    expect(callback).toHaveBeenNthCalledWith(4, second)
    expect(callback).toHaveBeenCalledTimes(4)
    stop()
  })
})
