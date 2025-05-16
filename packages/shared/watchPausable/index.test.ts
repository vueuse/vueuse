import { describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { pausableWatch, watchPausable } from './index'

describe('watchPausable', () => {
  it('should export module', () => {
    expect(watchPausable).toBeDefined()
    expect(pausableWatch).toBeDefined()
  })

  it('should work', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    const { stop, pause, resume, isActive } = watchPausable(num, cb)

    num.value = 1
    await nextTick()
    expect(isActive.value).toBeTruthy()
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())

    pause()
    num.value = 2
    await nextTick()
    expect(isActive.value).toBeFalsy()
    expect(cb).toHaveBeenCalledTimes(1)

    resume()
    num.value = 3
    await nextTick()
    expect(isActive.value).toBeTruthy()
    expect(cb).toHaveBeenCalledWith(3, 2, expect.anything())

    stop()
    num.value = 4
    await nextTick()
    expect(isActive.value).toBeTruthy()
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with initialState "paused"', async () => {
    const num = shallowRef(0)
    const cb = vi.fn()
    const { resume, isActive } = watchPausable(num, cb, { initialState: 'paused' })

    expect(isActive.value).toBeFalsy()
    expect(cb).not.toHaveBeenCalled()
    num.value = 1
    await nextTick()
    expect(isActive.value).toBeFalsy()
    expect(cb).not.toHaveBeenCalled()

    resume()
    expect(isActive.value).toBeTruthy()
    expect(cb).not.toHaveBeenCalled()
    num.value = 2
    await nextTick()
    expect(isActive.value).toBeTruthy()
    expect(cb).toHaveBeenCalledWith(2, 1, expect.anything())
  })
})
