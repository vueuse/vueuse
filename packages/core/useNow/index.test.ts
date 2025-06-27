import { describe, expect, it, vi } from 'vitest'
import { useNow } from './index'

describe('useNow', () => {
  vi.useFakeTimers()
  it('should get now timestamp by default', async () => {
    const now = useNow()

    expect(+now.value).toBeLessThanOrEqual(+new Date())
  })

  it('starts lazily if immediate is false', () => {
    const initial = +new Date()
    const { now, resume } = useNow({ controls: true, immediate: false })

    expect(+now.value).toBe(initial)
    vi.advanceTimersByTime(50)
    expect(+now.value).toBe(initial)

    resume()
    vi.advanceTimersByTime(50)
    expect(+now.value).toBeGreaterThan(initial)
  })

  function testControl(interval: any) {
    it(`should control now timestamp by ${interval}`, async () => {
      let initial = +new Date()
      const { now, pause, resume } = useNow({ controls: true, interval })

      expect(+now.value).toBeGreaterThanOrEqual(initial)

      vi.advanceTimersByTime(50)

      expect(+now.value).toBeGreaterThan(initial)

      initial = +now.value

      pause()
      vi.advanceTimersByTime(50)

      expect(+now.value).toBe(initial)

      resume()
      vi.advanceTimersByTime(50)

      expect(+now.value).toBeGreaterThan(initial)
    })
  }

  testControl('requestAnimationFrame')
  testControl(50)
})
