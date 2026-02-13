import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useWebWorkerInterval } from './index'

describe('useWebWorkerInterval', () => {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('basic pause/resume', async () => {
    const callback = vi.fn()
    const interval = 50

    const { pause, resume, isActive } = useWebWorkerInterval(callback, interval)

    expect(isActive.value).toBe(true)

    await vi.waitUntil(() => callback.mock.calls.length >= 1, { timeout: 1000, interval: 10 })
    expect(callback).toHaveBeenCalled()

    pause()
    expect(isActive.value).toBe(false)
    const countAfterPause = callback.mock.calls.length

    await sleep(interval * 3)
    expect(callback.mock.calls.length).toBe(countAfterPause)

    resume()
    expect(isActive.value).toBe(true)

    await vi.waitUntil(() => callback.mock.calls.length > countAfterPause, { timeout: 1000, interval: 10 })
    expect(callback.mock.calls.length).toBeGreaterThan(countAfterPause)

    pause()
  })

  it('pause/resume with immediateCallback', async () => {
    const callback = vi.fn()
    const interval = 50

    const { pause, resume, isActive } = useWebWorkerInterval(callback, interval, {
      immediateCallback: true,
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(isActive.value).toBe(true)

    await vi.waitUntil(() => callback.mock.calls.length > 1, { timeout: 1000, interval: 10 })

    pause()
    expect(isActive.value).toBe(false)
    const countAfterPause = callback.mock.calls.length

    await sleep(interval * 3)
    expect(callback.mock.calls.length).toBe(countAfterPause)

    resume()
    expect(isActive.value).toBe(true)

    await vi.waitUntil(() => callback.mock.calls.length > countAfterPause, { timeout: 1000, interval: 10 })

    pause()
  })

  it('pause/resume in scope', async () => {
    const callback = vi.fn()
    const interval = 50
    const scope = effectScope()

    let control: ReturnType<typeof useWebWorkerInterval>

    scope.run(() => {
      control = useWebWorkerInterval(callback, interval)
    })

    expect(control!.isActive.value).toBe(true)
    await vi.waitUntil(() => callback.mock.calls.length >= 1, { timeout: 1000, interval: 10 })

    scope.stop()

    expect(control!.isActive.value).toBe(false)

    const countAfterStop = callback.mock.calls.length
    await sleep(interval * 3)
    expect(callback.mock.calls.length).toBe(countAfterStop)
  })

  it('pause in callback', async () => {
    const interval = 50
    let count = 0
    let control: ReturnType<typeof useWebWorkerInterval>

    const callback = vi.fn(() => {
      count++
      if (count === 1) {
        control.pause()
      }
    })

    control = useWebWorkerInterval(callback, interval)

    await vi.waitUntil(() => count === 1, { timeout: 1000, interval: 10 })

    expect(control.isActive.value).toBe(false)

    await sleep(interval * 3)
    expect(count).toBe(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('cant work when interval is negative', async () => {
    const callback = vi.fn()
    const interval = -10

    const { isActive } = useWebWorkerInterval(callback, interval)

    expect(isActive.value).toBe(false)

    await sleep(100)
    expect(callback).not.toHaveBeenCalled()
  })
})
