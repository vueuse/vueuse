import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useDebounceFn } from '.'

describe('useDebounceFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should export function', () => {
    expect(useDebounceFn).toBeDefined()
  })

  it('should debounce function', async () => {
    const fn = vi.fn()
    const debouncedFn = useDebounceFn(fn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(fn).not.toBeCalled()

    await vi.advanceTimersByTime(100)
    expect(fn).toBeCalledTimes(1)
  })

  it('should work with ref delay', async () => {
    const fn = vi.fn()
    const ms = ref(100)
    const debouncedFn = useDebounceFn(fn, ms)

    debouncedFn()
    await vi.advanceTimersByTime(50)

    ms.value = 200
    debouncedFn()

    await vi.advanceTimersByTime(150)
    expect(fn).not.toBeCalled()

    await vi.advanceTimersByTime(50)
    expect(fn).toBeCalledTimes(1)
  })

  it('should respect maxWait option', async () => {
    const fn = vi.fn()
    const debouncedFn = useDebounceFn(fn, 200, { maxWait: 300 })

    debouncedFn()

    for (let i = 0; i < 5; i++) {
      await vi.advanceTimersByTime(100)
      debouncedFn()
    }

    expect(fn).toBeCalledTimes(1)

    await vi.advanceTimersByTime(200)

    expect(fn).toBeCalledTimes(2)
  })

  it('should handle promise resolution', async () => {
    const fn = vi.fn().mockResolvedValue('result')
    const debouncedFn = useDebounceFn(fn, 100)

    const promise = debouncedFn()
    await vi.advanceTimersByTime(100)

    await expect(promise).resolves.toBe('result')
  })

  it('should cancel pending execution', async () => {
    const fn = vi.fn()
    const debouncedFn = useDebounceFn(fn, 100)

    debouncedFn()
    debouncedFn.cancel()

    await vi.advanceTimersByTime(100)
    expect(fn).not.toBeCalled()
  })

  it('should reject on cancel when rejectOnCancel is true', async () => {
    const fn = vi.fn().mockResolvedValue('result')
    const debouncedFn = useDebounceFn(fn, 100, { rejectOnCancel: true })

    const promise = debouncedFn()
    debouncedFn.cancel()

    await expect(promise).rejects.toBeUndefined()
  })

  it('should resolve with undefined on cancel by default', async () => {
    const fn = vi.fn().mockResolvedValue('result')
    const debouncedFn = useDebounceFn(fn, 100)

    const promise = debouncedFn()
    debouncedFn.cancel()

    await expect(promise).resolves.toBeUndefined()
  })
})
