import { ref } from 'vue-demi'
import { Key, useInjectedSetup } from '../../.test'
import { computedInject } from '.'

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
      }, ref(10))

      expect(computedNum.value).toBe(2)
      expect(anotherComputedNum.value).toBe(11)
    })
  })
})
