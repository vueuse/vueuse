import { nextTick, ref } from 'vue-demi'
import { watchDeep } from '.'

describe('watchDeep', () => {
  it('should work when nested value is updated', async () => {
    const spy = vitest.fn((objectUpdate) => {
      expect(objectUpdate).toEqual({ foo: { bar: { deep: 10 } } })
    })

    const obj = ref({ foo: { bar: { deep: 5 } } })
    watchDeep(obj, spy)
    obj.value.foo.bar.deep = 10
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })
})
