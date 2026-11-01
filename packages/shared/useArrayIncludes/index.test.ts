import { describe, expect, it } from 'vitest'
import { ref as deepRef } from 'vue'
import { useArrayIncludes } from './index'

describe('useArrayIncludes', () => {
  it('should accept fromIndex without a comparator', () => {
    const array = deepRef([1, 2, 3])
    const result = useArrayIncludes(array, 1, { fromIndex: 1 })
    expect(result.value).toBe(false)
    array.value.push(1)
    expect(result.value).toBe(true)
    expect(useArrayIncludes(array, 2, { fromIndex: -2 }).value).toBe(false)
  })

  it('should accept an empty options object', () => {
    expect(useArrayIncludes([1, 2, 3], 2, {}).value).toBe(true)
    expect(useArrayIncludes([1, 2, 3], 4, {}).value).toBe(false)
  })

  it('should be defined', () => {
    expect(useArrayIncludes).toBeDefined()
  })

  it('should work with array of refs', () => {
    const array = deepRef([0, 2, 4, 6])
    const result = useArrayIncludes(array, 8)
    expect(result.value).toBeFalsy()
    array.value.push(8)
    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })

  it('should work with array of refs and comparator', () => {
    const array = deepRef([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(array, 3, 'id')
    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })

  it('should work with array of refs and comparatorFn', () => {
    const array = deepRef([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(array, { id: 3 }, (element, value) => element.id === value.id)
    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })

  it('should work with array of refs and fromIndex', () => {
    const array = deepRef([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(array, { id: 1 }, { fromIndex: 1, comparator: (element, value) => element.id === value.id })
    expect(result.value).toBeFalsy()
  })
})
