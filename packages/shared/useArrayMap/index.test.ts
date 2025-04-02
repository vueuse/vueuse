import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { useArrayMap } from './index'

describe('useArrayMap', () => {
  it('should be defined', () => {
    expect(useArrayMap).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = shallowRef(0)
    const item2 = shallowRef(2)
    const item3 = shallowRef(4)
    const item4 = shallowRef(6)
    const item5 = shallowRef(8)
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayMap(list, i => i * 2)
    expect(result.value).toStrictEqual([0, 4, 8, 12, 16])
    item1.value = 1
    expect(result.value).toStrictEqual([2, 4, 8, 12, 16])
  })

  it('should work with reactive array', () => {
    const list = deepRef([0, 1, 2, 3, 4])
    const result = useArrayMap(list, i => i * 2)
    expect(result.value).toStrictEqual([0, 2, 4, 6, 8])
    list.value.pop()
    expect(result.value).toStrictEqual([0, 2, 4, 6])
  })

  it('should match the return type of mapper function', () => {
    const list = deepRef([0, 1, 2, 3])
    const result1 = useArrayMap(list, i => i.toString())
    result1.value.forEach(i => expect(i).toBeTypeOf('string'))

    const result2 = useArrayMap(list, i => ({ value: i }))
    result2.value.forEach((item, idx) => {
      expect(item).toBeTypeOf('object')
      expect(item).toHaveProperty('value', idx)
    })
  })
})
