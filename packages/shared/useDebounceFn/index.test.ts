import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounceFn } from './index'

describe('useDebounceFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(useDebounceFn).toBeDefined()
  })

  it('should debounce the function execution', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(50)
    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should reset the debounce timer on subsequent calls', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100)

    debounced()
    await vi.advanceTimersByTimeAsync(50)
    debounced()
    await vi.advanceTimersByTimeAsync(50)
    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments to the debounced function', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100)

    debounced('a', 'b')
    await vi.advanceTimersByTimeAsync(100)

    expect(fn).toHaveBeenCalledWith('a', 'b')
  })

  it('should use default delay of 200ms', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn)

    debounced()
    await vi.advanceTimersByTimeAsync(100)
    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should return a promise that resolves with the function result', async () => {
    const fn = vi.fn(() => 'result')
    const debounced = useDebounceFn(fn, 100)

    const promise = debounced()
    await vi.advanceTimersByTimeAsync(100)
    const result = await promise

    expect(result).toBe('result')
  })

  it('should expose isPending ref', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100)

    expect(debounced.isPending.value).toBe(false)

    debounced()
    expect(debounced.isPending.value).toBe(true)

    await vi.advanceTimersByTimeAsync(100)
    expect(debounced.isPending.value).toBe(false)
  })

  it('should support cancel', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100)

    debounced()
    debounced.cancel()

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).not.toHaveBeenCalled()
    expect(debounced.isPending.value).toBe(false)
  })

  it('should support flush', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    debounced.flush()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(debounced.isPending.value).toBe(false)
  })

  it('should execute immediately when debounceInitialExecution is false', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100, { debounceInitialExecution: false })

    debounced()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should debounce subsequent calls when debounceInitialExecution is false', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100, { debounceInitialExecution: false })

    // First call executes immediately
    debounced()
    expect(fn).toHaveBeenCalledTimes(1)

    // Second call should be debounced
    debounced()
    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should debounce by default (debounceInitialExecution defaults to true)', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100, { debounceInitialExecution: true })

    debounced()
    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should reset debounceInitialExecution behavior after cancel', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100, { debounceInitialExecution: false })

    // First call executes immediately
    debounced()
    expect(fn).toHaveBeenCalledTimes(1)

    // Cancel pending state
    debounced.cancel()

    // After cancel, the function has already executed once,
    // so subsequent calls should still be debounced
    debounced()
    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should work with maxWait option', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100, { maxWait: 200 })

    debounced()
    await vi.advanceTimersByTimeAsync(50)
    debounced()
    await vi.advanceTimersByTimeAsync(50)
    debounced()
    await vi.advanceTimersByTimeAsync(50)
    debounced()
    await vi.advanceTimersByTimeAsync(50)

    expect(fn).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should work with rejectOnCancel option', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100, { rejectOnCancel: true })

    const promise = debounced()
    debounced.cancel()

    await expect(promise).rejects.toBeUndefined()
  })

  it('should combine debounceInitialExecution with maxWait', async () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100, {
      debounceInitialExecution: false,
      maxWait: 200,
    })

    // First call executes immediately
    debounced()
    expect(fn).toHaveBeenCalledTimes(1)

    // Subsequent calls should be debounced
    debounced()
    await vi.advanceTimersByTimeAsync(50)
    debounced()
    await vi.advanceTimersByTimeAsync(50)

    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
