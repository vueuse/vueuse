import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { useTimeoutPoll } from '.'

describe('useTimeoutPoll', () => {
  vi.useFakeTimers()
  function createTests(immediate: boolean) {
    it(`supports reactive intervals when immediate is ${immediate}`, async () => {
      const callback = vi.fn()
      const interval = ref(0)
      const { pause, resume } = useTimeoutPoll(callback, interval, { immediate })

      if (!immediate)
        resume()
      expect(callback).toBeCalled()
      pause()

      interval.value = 10

      resume()
      callback.mockReset()
      expect(callback).not.toBeCalled()
      await vi.advanceTimersByTimeAsync(11)
      expect(callback).toBeCalled()

      callback.mockReset()
      pause()
      await vi.advanceTimersByTimeAsync(11)
      expect(callback).not.toBeCalled()

      resume()
      expect(callback).toBeCalled()

      callback.mockReset()
      await vi.advanceTimersByTimeAsync(11)
      expect(callback).toBeCalled()
    })

    it(`should pause when scope dispose and immediate is ${immediate}`, async () => {
      const callback = vi.fn()
      const interval = ref(0)
      const scope = effectScope()
      await scope.run(async () => {
        const { resume } = useTimeoutPoll(callback, interval, { immediate })

        if (!immediate)
          resume()
        await nextTick()
        expect(callback).toBeCalled()
      })
      callback.mockReset()
      scope.stop()
      interval.value = 10
      await vi.advanceTimersByTimeAsync(11)
      expect(callback).not.toBeCalled()
    })
  }

  createTests(true)
  createTests(false)
})
