import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { useArrayEvery } from './index'

describe('useArrayEvery', () => {
  it('should be defined', () => {
    expect(useArrayEvery).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = shallowRef(0)
    const item2 = shallowRef(2)
    const item3 = shallowRef(4)
    const item4 = shallowRef(6)
    const item5 = shallowRef(8)
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayEvery(list, i => i % 2 === 0)
    expect(result.value).toBe(true)
    item1.value = 1
    expect(result.value).toBe(false)
  })

  it('should work with reactive array', () => {
    const list = deepRef([0, 2, 4, 6, 8])
    const result = useArrayEvery(list, i => i % 2 === 0)
    expect(result.value).toBe(true)
    list.value.push(9)
    expect(result.value).toBe(false)
  })
})
