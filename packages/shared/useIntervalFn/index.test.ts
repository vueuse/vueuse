import type { Pausable } from '../utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { useIntervalFn } from './index'

describe('useIntervalFn', () => {
  let callback = vi.fn()

  beforeEach(() => {
    callback = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  async function exec({ isActive, pause, resume }: Pausable) {
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

  async function execImmediateCallback({ isActive, pause, resume }: Pausable) {
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
    await exec(useIntervalFn(callback, 50))

    callback = vi.fn()

    const interval = shallowRef(50)
    await exec(useIntervalFn(callback, interval))

    callback.mockClear()
    interval.value = 20
    await vi.advanceTimersByTimeAsync(30)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('pause/resume with immediateCallback', async () => {
    await execImmediateCallback(useIntervalFn(callback, 50, { immediateCallback: true }))

    callback = vi.fn()

    const interval = shallowRef(50)
    await execImmediateCallback(useIntervalFn(callback, interval, { immediateCallback: true }))

    callback.mockClear()
    interval.value = 20
    await nextTick()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('pause/resume in scope', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      await exec(useIntervalFn(callback, 50))
    })
    callback.mockClear()
    await scope.stop()
    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('pause in callback', async () => {
    const pausable = useIntervalFn(() => {
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

  it('останавливает текущий таймер при переходе к нулю', async () => {
    const interval = shallowRef(50)
    const controls = useIntervalFn(callback, interval)
    await vi.advanceTimersByTimeAsync(50)
    expect(callback).toHaveBeenCalledTimes(1)

    interval.value = 0
    await nextTick()
    await vi.advanceTimersByTimeAsync(200)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
    controls.pause()
  })

  it('возобновляет запрошенный таймер после начального нуля', async () => {
    const interval = shallowRef(0)
    const controls = useIntervalFn(callback, interval)
    interval.value = 50
    await nextTick()
    await vi.advanceTimersByTimeAsync(50)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(controls.isActive.value).toBe(true)
    controls.pause()
  })

  it('сохраняет явную паузу при изменении интервала', async () => {
    const interval = shallowRef(50)
    const controls = useIntervalFn(callback, interval)
    controls.pause()
    interval.value = 0
    await nextTick()
    interval.value = 25
    await nextTick()
    await vi.advanceTimersByTimeAsync(100)
    expect(callback).not.toHaveBeenCalled()
    expect(controls.isActive.value).toBe(false)
  })

  it.each([0, -1])('возобновляет таймер после недопустимого интервала %s', async (value) => {
    const interval = shallowRef(20)
    const controls = useIntervalFn(callback, () => interval.value, { immediateCallback: true })
    expect(callback).toHaveBeenCalledTimes(1)
    interval.value = value
    await nextTick()
    expect(controls.isActive.value).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
    await vi.advanceTimersByTimeAsync(100)
    expect(callback).toHaveBeenCalledTimes(1)

    interval.value = 10
    await nextTick()
    expect(callback).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(10)
    expect(callback).toHaveBeenCalledTimes(3)
    controls.pause()
  })

  it('не запускает таймер при immediate: false до явного resume', async () => {
    const interval = shallowRef(0)
    const controls = useIntervalFn(callback, interval, { immediate: false })
    interval.value = 10
    await nextTick()
    await vi.advanceTimersByTimeAsync(100)
    expect(callback).not.toHaveBeenCalled()
    interval.value = 0
    await nextTick()
    controls.resume()
    expect(controls.isActive.value).toBe(false)
    interval.value = 10
    await nextTick()
    await vi.advanceTimersByTimeAsync(10)
    expect(callback).toHaveBeenCalledTimes(1)
    controls.pause()
  })

  it('не возобновляет таймер после удаления scope', async () => {
    const interval = shallowRef(0)
    const scope = effectScope()
    scope.run(() => useIntervalFn(callback, interval))
    scope.stop()
    interval.value = 10
    await nextTick()
    await vi.advanceTimersByTimeAsync(100)
    expect(callback).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cant work when interval is negative', async () => {
    const { isActive } = useIntervalFn(callback, -1)

    expect(isActive.value).toBeFalsy()
    await vi.advanceTimersByTimeAsync(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
