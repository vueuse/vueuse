import type { Pausable } from '@vueuse/shared'
import type { UseCountdownOptions } from '.'
import { promiseTimeout } from '@vueuse/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useCountdown } from '.'

describe('useCountdown', () => {
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
    await promiseTimeout(110)
    expect(tickCallback).toHaveBeenCalledTimes(1)

    pause()
    expect(isActive.value).toBeFalsy()

    await promiseTimeout(110)
    expect(tickCallback).toHaveBeenCalledTimes(1)

    resume()
    expect(isActive.value).toBeTruthy()

    await promiseTimeout(110)
    expect(tickCallback).toHaveBeenCalledTimes(2)

    await promiseTimeout(110)
    expect(tickCallback).toHaveBeenCalledTimes(3)
    expect(completeCallback).toHaveBeenCalledTimes(1)
  }

  it('basic start/stop', async () => {
    const { isActive, stop, start, remaining } = useCountdown(countdown, options)
    expect(isActive.value).toBeTruthy()
    expect(completeCallback).toHaveBeenCalledTimes(0)

    await promiseTimeout(110)

    expect(tickCallback).toHaveBeenCalledTimes(1)
    expect(completeCallback).toHaveBeenCalledTimes(0)

    stop()
    expect(isActive.value).toBeFalsy()
    await promiseTimeout(110)

    expect(tickCallback).toHaveBeenCalledTimes(1)
    expect(remaining.value).toBe(countdown)

    tickCallback.mockClear()
    completeCallback.mockClear()

    start()

    expect(isActive.value).toBeTruthy()
    await promiseTimeout(210)

    expect(tickCallback).toHaveBeenCalledTimes(2)
    expect(completeCallback).toHaveBeenCalledTimes(0)

    expect(remaining.value).toBe(1)

    await promiseTimeout(110)
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
    await scope.stop()
    await promiseTimeout(300)
    expect(tickCallback).toHaveBeenCalledTimes(0)
  })

  it('cant work when interval is negative', async () => {
    const { isActive } = useCountdown(5, { interval: -1 })

    expect(isActive.value).toBeFalsy()
    await promiseTimeout(60)
    expect(tickCallback).toHaveBeenCalledTimes(0)
  })
})
