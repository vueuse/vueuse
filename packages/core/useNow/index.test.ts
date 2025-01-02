import { describe, expect, it, vi } from 'vitest'
import { useNow } from '.'

describe('useNow', () => {
  vi.useFakeTimers()
  it('should get now timestamp by default', async () => {
    const now = useNow()

    expect(+now.value).toBeLessThanOrEqual(+new Date())
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
