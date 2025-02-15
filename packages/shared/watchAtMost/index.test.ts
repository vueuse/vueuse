import { describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { watchAtMost } from './index'

describe('watchAtMost', () => {
  it('should work', async () => {
    const num = shallowRef(0)
    const spy = vi.fn()

    const { count } = watchAtMost(num, spy, {
      count: 2,
    })
    num.value = 1
    await nextTick()
    num.value = 2
    await nextTick()
    num.value = 3
    await nextTick()
    expect(spy).toBeCalledTimes(2)
    expect(count.value).toBe(2)
  })
})
