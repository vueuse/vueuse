import { nextTick, ref } from 'vue-demi'
import { describe, expect, it, vi } from 'vitest'
import { watchOnce } from '.'

describe('watchOnce', () => {
  it('should work', async () => {
    const num = ref(0)
    const spy = vi.fn()

    watchOnce(num, spy)
    num.value = 1
    await nextTick()
    num.value = 2
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })
})
