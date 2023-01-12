import { nextTick, ref } from 'vue-demi'
import { watchDeepImmediate } from '.'

describe('watchDeepImmediate', () => {
  it('should watch twice, once for immediate and one for value change', async () => {
    let currentRun = 1
    const spy = vitest.fn((valUpdate) => {
      if (currentRun === 1)
        expect(valUpdate).toEqual({ foo: { bar: { deep: 5 } } })

      if (currentRun >= 2)
        expect(valUpdate).toEqual({ foo: { bar: { deep: 10 } } })

      currentRun++
    })

    const obj = ref({ foo: { bar: { deep: 5 } } })
    watchDeepImmediate(obj, spy)
    obj.value.foo.bar.deep = 10
    await nextTick()
    expect(spy).toBeCalledTimes(2)
  })
})
