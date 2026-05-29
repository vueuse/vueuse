import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounceFn } from './index'

describe('useDebounceFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should work with default trailing behavior', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useDebounceFn(callback, ms)
    run()
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(ms)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should work with leading: true, trailing: false', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useDebounceFn(callback, ms, { leading: true, trailing: false })
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(ms)
    // No trailing invocation
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should work with leading: true, trailing: true', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useDebounceFn(callback, ms, { leading: true, trailing: true })
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(ms)
    // Trailing invocation because there were subsequent calls
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should work with leading: false, trailing: false', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useDebounceFn(callback, ms, { leading: false, trailing: false })
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(ms)
    expect(callback).toHaveBeenCalledTimes(0)
    // Second burst after cooldown
    run()
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(ms)
    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('should reset leading edge after delay expires', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useDebounceFn(callback, ms, { leading: true, trailing: false })
    // First burst
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(ms)
    // Second burst after delay
    run()
    expect(callback).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(ms)
    // Third burst
    run()
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('should return leading result via promise', async () => {
    const run = useDebounceFn(() => 'hello', 20, { leading: true, trailing: false })
    const promise = run()
    vi.advanceTimersByTime(20)
    expect(await promise).toBe('hello')
  })

  it('should work with maxWait and leading', async () => {
    const callback = vi.fn()
    const ms = 50
    const run = useDebounceFn(callback, ms, { maxWait: 100, leading: true, trailing: true })
    run()
    expect(callback).toHaveBeenCalledTimes(1) // leading fires at t=0

    // Keep calling within debounce window, resetting the timer
    vi.advanceTimersByTime(30)
    run() // t=30
    vi.advanceTimersByTime(30)
    run() // t=60
    vi.advanceTimersByTime(30)
    run() // t=90
    expect(callback).toHaveBeenCalledTimes(1)

    // maxWait was set at t=0 during leading call, triggers at t=100
    vi.advanceTimersByTime(10)
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
