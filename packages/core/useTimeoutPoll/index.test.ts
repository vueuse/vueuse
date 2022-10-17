import { effectScope, ref } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import { useTimeoutPoll } from '.'

describe('useTimeoutPoll', () => {
  function createTests(immediate: boolean) {
    it(`supports reactive intervals when immediate is ${immediate}`, async () => {
      const callback = vitest.fn()
      const interval = ref(0)
      const { pause, resume } = useTimeoutPoll(callback, interval, { immediate })

      immediate || resume()
      await promiseTimeout(1)
      expect(callback).toBeCalled()
      pause()

      interval.value = 50

      resume()
      callback.mockReset()

      await promiseTimeout(1)
      expect(callback).not.toBeCalled()
      await promiseTimeout(101)
      expect(callback).toBeCalled()

      callback.mockReset()
      pause()
      await promiseTimeout(101)
      expect(callback).not.toBeCalled()

      resume()
      await promiseTimeout(1)
      expect(callback).toBeCalled()

      callback.mockReset()
      await promiseTimeout(101)
      expect(callback).toBeCalled()
    })

    it(`should pause when scope dispose and immediate is ${immediate}`, async () => {
      const callback = vitest.fn()
      const interval = ref(0)
      const scope = effectScope()
      await scope.run(async () => {
        const { resume } = useTimeoutPoll(callback, interval, { immediate })

        immediate || resume()
        await promiseTimeout(1)
        expect(callback).toBeCalled()
      })
      callback.mockReset()
      await scope.stop()
      interval.value = 50
      await promiseTimeout(51)
      expect(callback).not.toBeCalled()
    })
  }

  createTests(true)
  createTests(false)
})
