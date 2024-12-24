import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottleFn } from '.'

describe('useThrottleFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should be defined', () => {
    expect(useThrottleFn).toBeDefined()
  })

  it('should work', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottleFn(callback, ms)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(ms + 10)
    run()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should work with trailing', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottleFn(callback, ms, true)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(ms + 10)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should work with leading', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottleFn(callback, ms, false, false)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(ms + 10)
    run()
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(ms + 20)
    run()
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
