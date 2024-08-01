import { effectScope } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Pausable } from '../utils'
import type { UseCountdownOptions } from '.'
import { useCountdown } from '.'

describe('useCountdown', () => {
  let tickCallback = vi.fn()
  let completeCallback = vi.fn()
  let countdown = 3
  let interval = 100
  let repeatCount = 3
  const immediate = true
  let options: UseCountdownOptions = {
    interval,
    repeatCount,
    onComplete: completeCallback,
    onTick: tickCallback,
    immediate,
  }
  beforeEach(() => {
    tickCallback = vi.fn()
    completeCallback = vi.fn()
    countdown = 3
    interval = 100
    repeatCount = 3
    options = {
      interval,
      repeatCount,
      onComplete: completeCallback,
      onTick: tickCallback,
      immediate,
    }
  })

  async function exec({ isActive, pause, resume }: Pausable) {
    expect(isActive.value).toBeTruthy()
    expect(completeCallback).toHaveBeenCalledTimes(0)

    await promiseTimeout(700)
    expect(tickCallback).toHaveBeenCalledTimes(6)
    expect(completeCallback).toHaveBeenCalledTimes(2)

    pause()
    expect(isActive.value).toBeFalsy()

    await promiseTimeout(100)
    expect(tickCallback).toHaveBeenCalledTimes(6)
    expect(completeCallback).toHaveBeenCalledTimes(2)

    resume()
    expect(isActive.value).toBeTruthy()

    await promiseTimeout(100)
    expect(tickCallback).toHaveBeenCalledTimes(7)
    expect(completeCallback).toHaveBeenCalledTimes(2)
  }

  it('basic start/stop', async () => {
    const { isActive, stop, start, remaining, completedCount } = useCountdown(countdown, options)
    expect(isActive.value).toBeTruthy()
    expect(completeCallback).toHaveBeenCalledTimes(0)
    await promiseTimeout(400)

    expect(tickCallback).toHaveBeenCalledTimes(3)
    expect(completeCallback).toHaveBeenCalledTimes(1)

    stop()
    expect(isActive.value).toBeFalsy()
    await promiseTimeout(100)

    expect(tickCallback).toHaveBeenCalledTimes(3)
    expect(completeCallback).toHaveBeenCalledTimes(1)

    expect(completedCount.value).toBe(0)
    expect(remaining.value).toBe(countdown)

    tickCallback.mockClear()
    completeCallback.mockClear()

    start()

    expect(isActive.value).toBeTruthy()
    await promiseTimeout(800)

    expect(tickCallback).toHaveBeenCalledTimes(7)
    expect(completeCallback).toHaveBeenCalledTimes(2)

    expect(completedCount.value).toBe(2)
    expect(remaining.value).toBe(2)

    await promiseTimeout(1000)
    expect(completedCount.value).toBe(3)
    expect(remaining.value).toBe(0)
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
    await scope.stop()
    await promiseTimeout(600)
    expect(tickCallback).toHaveBeenCalledTimes(0)
  })

  it('cant work when interval is negative', async () => {
    const { isActive } = useCountdown(5, { interval: -1 })

    expect(isActive.value).toBeFalsy()
    await promiseTimeout(60)
    expect(tickCallback).toHaveBeenCalledTimes(0)
  })
})
