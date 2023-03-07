import { nextTick, ref } from 'vue-demi'
import { watchImmediate } from '.'

describe('watchImmediate', () => {
  it('should watch twice, once for immediate and one for value change', async () => {
    let currentRun = 1
    const spy = vitest.fn((valUpdate) => {
      if (currentRun === 1)
        expect(valUpdate).toEqual('vue-use')

      if (currentRun >= 2)
        expect(valUpdate).toEqual('VueUse')

      currentRun++
    })

    const obj = ref('vue-use')
    watchImmediate(obj, spy)
    obj.value = 'VueUse'
    await nextTick()
    expect(spy).toBeCalledTimes(2)
  })
})
