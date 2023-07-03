import { describe, expect, it, vi } from 'vitest'
import { useDelayedPromise } from '.'

describe('useDelayedPromise', () => {
  it('should be defined', () => {
    expect(useDelayedPromise).toBeDefined()
  })

  it('should resolve after specified delay', async () => {
    const promise = new Promise(resolve => setTimeout(resolve, 100))

    const useDelayedPromiseSpy = vi.fn(useDelayedPromise)

    vi.useFakeTimers()

    await useDelayedPromiseSpy(promise, 500)

    vi.advanceTimersByTime(499)

    expect(useDelayedPromiseSpy).toHaveBeenCalledTimes(0)

    vi.advanceTimersToNextTimer()

    expect(useDelayedPromiseSpy).toHaveBeenCalledOnce()
  })
})
