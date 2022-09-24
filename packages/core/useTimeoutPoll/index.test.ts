import { ref } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import { useTimeoutPoll } from '.'

describe('useTimeoutFn', () => {
  it('supports reactive intervals', async () => {
    const callback = vitest.fn()
    const interval = ref(0)
    const { pause, resume } = useTimeoutPoll(callback, interval)

    resume()
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
})
