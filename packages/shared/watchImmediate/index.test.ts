import type { ModelRef } from 'vue'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { watchImmediate } from './index'

describe('watchImmediate', () => {
  it('should watch twice, once for immediate and one for value change', async () => {
    let currentRun = 1
    const spy = vi.fn((valUpdate) => {
      if (currentRun === 1)
        expect(valUpdate).toEqual('vue-use')

      if (currentRun >= 2)
        expect(valUpdate).toEqual('VueUse')

      currentRun++
    })

    const obj = shallowRef('vue-use')
    watchImmediate(obj, spy)
    obj.value = 'VueUse'
    await nextTick()
    expect(spy).toBeCalledTimes(2)
  })

  it('should infer model ref type correctly', () => {
    const modalValue = shallowRef(0) as ModelRef<number>
    watchImmediate(modalValue, (val) => {
      expectTypeOf(val).toBeNumber()
    })
  })
})
