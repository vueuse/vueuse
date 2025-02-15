import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { useArrayFilter } from './index'

describe('useArrayFilter', () => {
  it('should be defined', () => {
    expect(useArrayFilter).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = shallowRef(0)
    const item2 = shallowRef(2)
    const item3 = shallowRef(4)
    const item4 = shallowRef(6)
    const item5 = shallowRef(8)
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayFilter(list, i => i % 2 === 0)
    expect(result.value).toStrictEqual([0, 2, 4, 6, 8])
    item2.value = 1
    expect(result.value).toStrictEqual([0, 4, 6, 8])
  })

  it('should work with reactive array', () => {
    const list = deepRef([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    const result = useArrayFilter(list, i => i % 2 === 0)
    expect(result.value).toStrictEqual([0, 2, 4, 6, 8])
    list.value.shift()
    expect(result.value).toStrictEqual([2, 4, 6, 8])
  })

  it('should allow values other than boolean in fn', () => {
    const list = deepRef([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    const result = useArrayFilter(list, i => i % 2)
    expect(result.value).toStrictEqual([1, 3, 5, 7, 9])
  })
})
