import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { useArrayFindIndex } from './index'

describe('useArrayFindIndex', () => {
  it('should be defined', () => {
    expect(useArrayFindIndex).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = shallowRef(0)
    const item2 = shallowRef(2)
    const item3 = shallowRef(4)
    const item4 = shallowRef(6)
    const item5 = shallowRef(8)
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayFindIndex(list, i => i % 2 === 0)
    expect(result.value).toBe(0)
    item1.value = 1
    expect(result.value).toBe(1)
    item2.value = 3
    expect(result.value).toBe(2)
    item3.value = 5
    expect(result.value).toBe(3)
    item4.value = 7
    expect(result.value).toBe(4)
    item5.value = 9
    expect(result.value).toBe(-1)
  })

  it('should work with reactive array', () => {
    const list = deepRef([0, 2, 4, 6, 8])
    const result = useArrayFindIndex(list, i => i % 2 === 0)
    expect(result.value).toBe(0)
    list.value.unshift(-1)
    expect(result.value).toBe(1)
  })
})
