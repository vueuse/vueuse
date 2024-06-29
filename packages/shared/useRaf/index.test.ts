import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AnyFn } from '../utils'
import { useRaf } from '.'

describe('useRaf', () => {
  const spies = {
    cancel: undefined as any,
    request: undefined as any,
  }

  let simulateRAFAvailable: AnyFn

  /**
   * Setup mocks for window.(cancel|request)AnimationFrame methods
   */
  beforeEach(() => {
    const requests: (AnyFn | undefined)[] = []
    let time = 0

    /**
     * Call a single rAF callback
     */
    simulateRAFAvailable = () => {
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i]
        if (request) {
          time++
          request(time)
          requests[i] = undefined
          return
        }
      }
    }

    spies.cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((requestId) => {
      expect(requestId).toBeGreaterThan(0)

      const index = requestId - 1
      expect(requests[index]).toBeDefined()

      // Don't change the array indexes as requestId is the index of the array on rAF call
      requests[index] = undefined
    })

    spies.request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      requests.push(cb)

      const requestId = requests.length
      return requestId
    })
  })

  it('only executes on the next available rAF', async () => {
    const callback = vi.fn()
    const { request } = useRaf(callback)

    expect(callback).not.toBeCalled()
    expect(spies.request).not.toBeCalled()

    request()

    expect(spies.request).toHaveBeenCalledOnce()
    expect(callback).not.toBeCalled()

    simulateRAFAvailable()

    expect(callback).toHaveBeenCalledOnce()
  })

  it('executes all successive requests when not debouncing', async () => {
    const callback = vi.fn()
    const { request } = useRaf(callback, { debounce: false })

    expect(callback).not.toBeCalled()
    expect(spies.request).not.toBeCalled()

    request()
    request()
    request()

    expect(spies.request).toHaveBeenCalledTimes(3)
    expect(callback).not.toBeCalled()

    simulateRAFAvailable()
    simulateRAFAvailable()
    simulateRAFAvailable()
    simulateRAFAvailable()

    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('debounced successive requests until a rAF is available', async () => {
    const callback = vi.fn()
    const { request } = useRaf(callback, { debounce: true })

    // Callback is not called, as RAF hasn't triggered yet
    expect(callback).not.toBeCalled()
    // Spy is only triggered once we call request
    expect(spies.request).not.toBeCalled()

    request()
    request()
    request()

    // Spy is triggered
    expect(spies.request).toHaveBeenCalledTimes(3)
    // But callback not yet, is waiting for next RAF
    expect(callback).not.toBeCalled()

    // Simulate the awaited rAF call
    simulateRAFAvailable()
    simulateRAFAvailable()

    // Now callback has been executed
    expect(callback).toHaveBeenCalledOnce()
  })

  it('does not execute when cancel was called', async () => {
    const callback = vi.fn()
    const { cancel, request } = useRaf(callback)

    // Callback is not called, as RAF hasn't triggered yet
    expect(callback).not.toBeCalled()
    // Spy is only triggered once we call request
    expect(spies.cancel).not.toBeCalled()
    expect(spies.request).not.toBeCalled()

    // Perform new request
    request()

    // Spy is triggered
    expect(spies.request).toHaveBeenCalledOnce()
    expect(spies.cancel).not.toBeCalled()
    // But callback not yet, is waiting for next RAF
    expect(callback).not.toBeCalled()

    // Cancel the request
    cancel()

    expect(spies.cancel).toBeCalled()

    // Simulate the awaited rAF call
    simulateRAFAvailable()

    // Callback has not been executed
    expect(callback).not.toBeCalled()
  })
})
