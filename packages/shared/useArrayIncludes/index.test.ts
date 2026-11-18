import { describe, expect, it } from 'vitest'
import { ref as deepRef } from 'vue'
import { useArrayIncludes } from './index'

describe('useArrayIncludes', () => {
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

  it('should use default equality when the comparator is explicitly undefined', () => {
    const array = deepRef([0, 1])
    const result = useArrayIncludes(array, 1, undefined)

    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })

  it('should use default equality with an undefined comparator in options', () => {
    const array = deepRef([1, 2, 1])
    const result = useArrayIncludes(array, 1, { fromIndex: 1, comparator: undefined })

    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })

  it.each([0, Symbol('id')])('should compare property key %s', (key) => {
    const array = deepRef<Record<typeof key, number>[]>([{ [key]: 1 }, { [key]: 2 }])
    const result = useArrayIncludes(array, 2, key)

    expect(result.value).toBeTruthy()
    array.value.pop()
    expect(result.value).toBeFalsy()
  })

  it.each([0, Symbol('id')])('should compare property key %s in options', (key) => {
    const array = deepRef<Record<typeof key, number>[]>([{ [key]: 1 }, { [key]: 2 }])
    const result = useArrayIncludes(array, 1, { comparator: key, fromIndex: 1 })

    expect(result.value).toBeFalsy()
    array.value.push({ [key]: 1 })
    expect(result.value).toBeTruthy()
  })

  it('should work with array of refs and fromIndex', () => {
    const array = deepRef([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(array, { id: 1 }, { fromIndex: 1, comparator: (element, value) => element.id === value.id })
    expect(result.value).toBeFalsy()
  })
})
