import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { useArraySome } from './index'

describe('useArraySome', () => {
  it('should be defined', () => {
    expect(useArraySome).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = shallowRef(0)
    const item2 = shallowRef(2)
    const item3 = shallowRef(4)
    const item4 = shallowRef(6)
    const item5 = shallowRef(8)
    const list = [item1, item2, item3, item4, item5]
    const result = useArraySome(list, i => i > 10)
    expect(result.value).toBe(false)
    item1.value = 11
    expect(result.value).toBe(true)
  })

  it('should work with reactive array', () => {
    const list = deepRef([0, 2, 4, 6, 8])
    const result = useArraySome(list, i => i > 10)
    expect(result.value).toBe(false)
    list.value.push(11)
    expect(result.value).toBe(true)
  })
})
