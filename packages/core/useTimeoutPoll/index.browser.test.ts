import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, shallowRef } from 'vue'
import { useTimeoutPoll } from './index'

describe('useTimeoutPoll', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('basic pause/resume', async () => {
    const callback = vi.fn()
    const interval = shallowRef(0)
    const { pause, resume } = useTimeoutPoll(callback, interval)

    await vi.advanceTimersByTimeAsync(1)
    expect(callback).toBeCalled()
    pause()
    interval.value = 10

    resume()
    callback.mockReset()
    vi.advanceTimersByTime(1)
    expect(callback).not.toBeCalled()
    vi.advanceTimersByTime(10)
    expect(callback).toBeCalled()
  })

  it('pause/resume with immediateCallback', async () => {
    const callback = vi.fn()
    useTimeoutPoll(callback, 50, { immediateCallback: true })

    expect(callback).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(50)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('immediateCallback waits for the callback to finish', async () => {
    const callback = vi.fn(() => new Promise<void>(resolve => setTimeout(resolve, 50)))
    useTimeoutPoll(callback, 50, { immediateCallback: true })

    expect(callback).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(50)
    expect(callback).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(50)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('pause/resume in scope', async () => {
    const callback = vi.fn()
    const interval = shallowRef(0)
    const scope = effectScope()
    await scope.run(async () => {
      useTimeoutPoll(callback, interval)
      vi.advanceTimersByTime(1)
      expect(callback).toBeCalled()
    })
    callback.mockClear()
    await scope.stop()
    vi.advanceTimersByTime(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
