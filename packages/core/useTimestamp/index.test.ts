import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useTimestamp } from '.'

describe('useTimestamp', () => {
  vi.useFakeTimers()
  it('starts immediately by default', async () => {
    const timestamp = useTimestamp()
    const initial = timestamp.value

    vi.advanceTimersByTime(20)
    expect(timestamp.value).greaterThan(initial)
  })

  it('allows for a delayed start using requestAnimationFrame', async () => {
    const now = ref()
    const callback = vi.fn((time) => {
      now.value = time
    })
    const { resume, timestamp } = useTimestamp({
      controls: true,
      immediate: false,
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
      immediate: false,
      interval: 50,
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
