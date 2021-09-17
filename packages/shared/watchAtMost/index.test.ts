import { ref, isReadonly, nextTick } from 'vue-demi'
import { watchAtMost } from '.'

describe('watchAtMost', () => {
  it('should work', async() => {
    const num = ref(0)
    const spy = jest.fn()

    const { count } = watchAtMost(num, spy, {
      max: 1,
    })
    num.value = 1
    await nextTick()
    num.value = 2
    await nextTick()
    expect(spy).toBeCalledTimes(1)
    expect(count.value).toBe(1)
  })
  it('the count value should be readonly', async() => {
    const num = ref(0)
    const spy = jest.fn()

    const { count } = watchAtMost(num, spy, {
      max: 1,
    })
    num.value = 1
    await nextTick()
    expect(isReadonly(count)).toBe(true)
  })
})
