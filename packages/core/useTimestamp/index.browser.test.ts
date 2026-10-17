import type { AnyFn } from '@vueuse/shared'
import { useIntervalFn } from '@vueuse/shared'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref as deepRef } from 'vue'
import { useRafFn } from '../useRafFn'
import { useTimestamp } from './index'

describe('useTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts immediately by default', async () => {
    const timestamp = useTimestamp()
    const initial = timestamp.value

    vi.advanceTimersByTime(20)
    expect(timestamp.value).greaterThan(initial)
  })

  it('allows for a delayed start using requestAnimationFrame', async () => {
    const now = deepRef()
    const callback = vi.fn((time) => {
      now.value = time
    })
    const { resume, timestamp } = useTimestamp({
      controls: true,
      scheduler: (cb: AnyFn) => useRafFn(cb, { immediate: false }),
      callback,
    })

    const initial = timestamp.value

    vi.advanceTimersByTime(20)
    expect(timestamp.value).toBe(initial)
    expect(now.value).toBeUndefined()
    resume()
    vi.advanceTimersByTime(20)
    expect(timestamp.value).greaterThan(initial)
    expect(now.value).greaterThan(initial)
  })

  it('allows for a delayed start using common interval', async () => {
    let now
    const callback = vi.fn((time) => {
      now = time
    })
    const { resume, timestamp } = useTimestamp({
      controls: true,
      scheduler: (cb: AnyFn) => useIntervalFn(cb, 50, { immediate: false }),
      callback,
    })

    const initial = timestamp.value

    vi.advanceTimersByTime(50)

    expect(timestamp.value).toBe(initial)
    expect(now).toBeUndefined()

    resume()
    vi.advanceTimersByTime(50)

    expect(timestamp.value).greaterThan(initial)
    expect(now).greaterThan(initial)
  })
})
