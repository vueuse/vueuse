import type { useWebWorkerIntervalFnReturn } from '../index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { useWebWorkerInterval } from './index'

class MockWorker {
  interval = 0
  timerId = null as ReturnType<typeof setTimeout> | null
  onmessage: ((e: MessageEvent) => void) | null = null

  postMessage = vi.fn((data: [string, number]) => {
    const [status, delay] = data
    if (status === 'STARTED') {
      this.interval = delay
      if (this.timerId)
        clearTimeout(this.timerId!)
      this.start()
    }
    if (status === 'ENDED') {
      if (this.timerId!)
        clearTimeout(this.timerId!)
      this.timerId = null
    }
  })

  start() {
    const tick = () => {
      this.onmessage?.({ data: ['TICK'] } as MessageEvent)
      this.timerId = setTimeout(tick, this.interval)
    }
    this.timerId = setTimeout(tick, this.interval)
  }

  terminate = vi.fn()
}

describe('useWebWorkerInterval', () => {
  let callback = vi.fn()
  vi.useFakeTimers()

  beforeEach(() => {
    callback = vi.fn()
    vi.stubGlobal('Worker', MockWorker)

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:http://localhost/80'),
      revokeObjectURL: vi.fn(),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function exec({ isActive, pause, resume }: useWebWorkerIntervalFnReturn) {
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(0)

    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(1)

    pause()
    expect(isActive.value).toBeFalsy()

    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(1)

    resume()
    expect(isActive.value).toBeTruthy()

    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(2)
  }

  async function execImmediateCallback({ isActive, pause, resume }: useWebWorkerIntervalFnReturn) {
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(2)

    pause()
    expect(isActive.value).toBeFalsy()

    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(2)

    resume()
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(3)

    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(4)
  }

  it('basic pause/resume', async () => {
    await exec(useWebWorkerInterval(callback, 50))

    callback = vi.fn()

    const interval = shallowRef(50)
    await exec(useWebWorkerInterval(callback, interval))

    callback.mockClear()
    interval.value = 20
    await vi.advanceTimersByTimeAsync(30)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('pause/resume with immediateCallback', async () => {
    await execImmediateCallback(useWebWorkerInterval(callback, 50, { immediateCallback: true }))

    callback = vi.fn()

    const interval = shallowRef(50)
    await execImmediateCallback(useWebWorkerInterval(callback, interval, { immediateCallback: true }))

    callback.mockClear()
    interval.value = 20
    await nextTick()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('pause/resume in scope', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      await exec(useWebWorkerInterval(callback, 50))
    })
    callback.mockClear()
    await scope.stop()
    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('pause in callback', async () => {
    const pausable = useWebWorkerInterval(() => {
      callback()
      pausable.pause()
    }, 50, { immediateCallback: true, immediate: false })

    pausable.resume()
    expect(pausable.isActive.value).toBeFalsy()
    expect(callback).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(1)

    pausable.resume()
    expect(pausable.isActive.value).toBeFalsy()
    expect(callback).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('cant work when interval is negative', async () => {
    const { isActive } = useWebWorkerInterval(callback, -1)

    expect(isActive.value).toBeFalsy()
    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
