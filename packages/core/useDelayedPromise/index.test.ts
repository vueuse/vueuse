import { describe, expect, it, vi } from 'vitest'
import { useDelayedPromise } from '.'

describe('useDelayedPromise', () => {
  it('should be defined', () => {
    expect(useDelayedPromise).toBeDefined()
  })

  it('should resolve after specified delay', async () => {
    const useDelayedPromiseSpy = vi.fn(useDelayedPromise)

    vi.useFakeTimers()

    const promise = new Promise(resolve => setTimeout(resolve, 100))

    const delayedPromiseSpy = useDelayedPromiseSpy(promise, 500)

    vi.advanceTimersByTime(499)

    await expect(delayedPromiseSpy).resolves.toHaveReturnedTimes(0)

    vi.advanceTimersByTime(1)

    await expect(delayedPromiseSpy).resolves.toHaveReturnedTimes(1)
  })
})
