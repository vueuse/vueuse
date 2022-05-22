import { nextTick, ref } from 'vue-demi'
import { watchAtMost } from '.'

describe('watchAtMost', () => {
  it('should work', async () => {
    const num = ref(0)
    const spy = vitest.fn()

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
