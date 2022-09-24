import { ref } from 'vue-demi'
import { promiseTimeout } from '../utils'
import { useTimeoutFn } from '.'

describe('useTimeoutFn', () => {
  it('supports reactive intervals', async () => {
    const callback = vitest.fn()
    const interval = ref(0)
    const { start } = useTimeoutFn(callback, interval)

    start()
    await promiseTimeout(1)
    expect(callback).toBeCalled()

    callback.mockReset()
    interval.value = 50

    start()
    await promiseTimeout(1)
    expect(callback).not.toBeCalled()
    await promiseTimeout(100)
    expect(callback).toBeCalled()
  })
})
