import { nextTick, ref } from 'vue-demi'
import { promiseTimeout } from '../utils'
import { throttledWatch, watchThrottled } from '.'

describe('watchThrottled', () => {
  it('should export module', () => {
    expect(watchThrottled).toBeDefined()
    expect(throttledWatch).toBeDefined()
  })

  it('should work', async () => {
    const num = ref(0)
    const cb = vi.fn()
    watchThrottled(num, cb, { throttle: 100 })

    num.value = 1
    await nextTick()
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())

    num.value = 2
    await promiseTimeout(50)
    expect(cb).toHaveBeenCalledTimes(1)

    num.value = 3
    await promiseTimeout(50)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenCalledWith(3, 2, expect.anything())

    num.value = 4
    await promiseTimeout(110)
    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb).toHaveBeenCalledWith(4, 3, expect.anything())
  })
})
