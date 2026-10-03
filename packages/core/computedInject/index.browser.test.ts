import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { Key, useInjectedSetup } from '../../.test'
import { computedInject } from './index'

describe('computedInject', () => {
  it('should be defined', () => {
    expect(computedInject).toBeDefined()
  })

  it('should be computedRef', () => {
    useInjectedSetup(() => {
      const computedNum = computedInject(Key, (source) => {
        if (source)
          return source.value + 1
      })
      const anotherComputedNum = computedInject(Key, (source) => {
        if (source)
          return source.value + 10
      }, shallowRef(10))

      expect(computedNum.value).toBe(2)
      expect(anotherComputedNum.value).toBe(11)
    })
  })

  it('should pass oldValue to computed getter', () => {
    useInjectedSetup(() => {
      const curValue = shallowRef(0)
      const oldValue = shallowRef()

      const computedNum = computedInject(Key, (source, previous) => {
        oldValue.value = previous
        return curValue.value + (source?.value ?? 0)
      })

      expect(computedNum.value).toBe(1)
      expect(oldValue.value).toBeUndefined()

      curValue.value = 1

      expect(computedNum.value).toBe(2)
      expect(oldValue.value).toBe(1)
    })
  })
})
