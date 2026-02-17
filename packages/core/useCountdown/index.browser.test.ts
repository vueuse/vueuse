import type { Pausable } from '@vueuse/shared'
import type { UseCountdownOptions } from './index'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, shallowRef } from 'vue'
import { useCountdown } from './index'

describe('useCountdown', () => {
  vi.useFakeTimers()
  let tickCallback = vi.fn()
  let completeCallback = vi.fn()
  let countdown = 3
  let interval = 100
  const immediate = true
  let options: UseCountdownOptions = {
    interval,
    onComplete: completeCallback,
    onTick: tickCallback,
    immediate,
  }

  beforeEach(() => {
    tickCallback = vi.fn()
    completeCallback = vi.fn()
    countdown = 3
    interval = 100
    options = {
      interval,
      onComplete: completeCallback,
      onTick: tickCallback,
      immediate,
    }
  })

  async function exec({ isActive, pause, resume }: Pausable) {
    expect(isActive.value).toBeTruthy()
    expect(completeCallback).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(110)
    expect(tickCallback).toHaveBeenCalledTimes(1)

    pause()
    expect(isActive.value).toBeFalsy()

    vi.advanceTimersByTime(110)
    expect(tickCallback).toHaveBeenCalledTimes(1)

    resume()
    expect(isActive.value).toBeTruthy()

    vi.advanceTimersByTime(110)
    expect(tickCallback).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(110)
    expect(tickCallback).toHaveBeenCalledTimes(3)
    expect(completeCallback).toHaveBeenCalledTimes(1)
  }

  it('basic start/stop', async () => {
    const { isActive, stop, start, remaining } = useCountdown(countdown, options)
    expect(isActive.value).toBeTruthy()
    expect(completeCallback).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(110)

    expect(tickCallback).toHaveBeenCalledTimes(1)
    expect(completeCallback).toHaveBeenCalledTimes(0)

    stop()
    expect(isActive.value).toBeFalsy()
    vi.advanceTimersByTime(110)

    expect(tickCallback).toHaveBeenCalledTimes(1)
    expect(remaining.value).toBe(countdown)

    tickCallback.mockClear()
    completeCallback.mockClear()

    start()

    expect(isActive.value).toBeTruthy()
    vi.advanceTimersByTime(210)

    expect(tickCallback).toHaveBeenCalledTimes(2)
    expect(completeCallback).toHaveBeenCalledTimes(0)

    expect(remaining.value).toBe(1)

    vi.advanceTimersByTime(110)
    expect(remaining.value).toBe(0)
    expect(completeCallback).toHaveBeenCalledTimes(1)
  })

  it('basic pause/resume', async () => {
    await exec(useCountdown(countdown, options))
  })

  it('pause/resume in scope', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      await exec(useCountdown(countdown, options))
    })
    tickCallback.mockClear()
    scope.stop()
    vi.advanceTimersByTime(300)
    expect(tickCallback).toHaveBeenCalledTimes(0)
  })

  it('cant work when interval is negative', async () => {
    const { isActive } = useCountdown(5, { interval: -1 })

    expect(isActive.value).toBeFalsy()
    vi.advanceTimersByTime(60)
    expect(tickCallback).toHaveBeenCalledTimes(0)
  })

  it('initial interval can be changed', async () => {
    const countdown = shallowRef(3)

    const { start } = useCountdown(countdown, { ...options, immediate: false })

    countdown.value = 2
    start()
    vi.advanceTimersByTime(210)
    expect(completeCallback).toHaveBeenCalledTimes(1)
  })

  it('start can provide a custom interval', async () => {
    const { start, reset } = useCountdown(countdown, options)
    vi.advanceTimersByTime(countdown * interval + 10)
    expect(completeCallback).toHaveBeenCalledTimes(1)

    start(1)
    vi.advanceTimersByTime(110)
    expect(completeCallback).toHaveBeenCalledTimes(2)

    start()
    vi.advanceTimersByTime(110)
    expect(completeCallback).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(countdown * interval + 10)
    expect(completeCallback).toHaveBeenCalledTimes(3)

    start(1)
    reset()
    vi.advanceTimersByTime(110)
    expect(completeCallback).toHaveBeenCalledTimes(3)
  })
})
