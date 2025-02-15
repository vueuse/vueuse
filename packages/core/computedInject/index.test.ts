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
})
