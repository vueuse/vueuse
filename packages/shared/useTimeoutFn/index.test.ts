import { promiseTimeout } from '@vueuse/core'
import { ref } from 'vue-demi'
import { useTimeoutFn } from '.'

describe('useTimeoutFn', () => {
  it('supports reactive intervals', async() => {
    const callback = jest.fn()
    const interval = ref(0)
    const { start } = useTimeoutFn(callback, interval)

    start()
    await promiseTimeout(1)
    expect(callback).toHaveBeenCalled()

    callback.mockReset()
    interval.value = 50

    start()
    await promiseTimeout(1)
    expect(callback).not.toHaveBeenCalled()
    await promiseTimeout(100)
    expect(callback).toHaveBeenCalled()
  })
})
