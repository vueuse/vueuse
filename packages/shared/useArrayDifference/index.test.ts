import { describe, expect, it } from 'vitest'
import { ref as deepRef } from 'vue'
import { useArrayDifference } from './index'

describe('useArrayDifference', () => {
  it('should compare numeric property keys', () => {
    const list = deepRef([{ 0: 'a' }, { 0: 'b' }])
    const values = deepRef([{ 0: 'b' }])
    const result = useArrayDifference(list, values, 0)

    expect(result.value).toEqual([{ 0: 'a' }])
    values.value.push({ 0: 'a' })
    expect(result.value).toEqual([])
  })

  it('should compare symbol property keys in symmetric mode', () => {
    const key = Symbol('id')
    const first = { [key]: 1 }
    const second = { [key]: 2 }
    const third = { [key]: 3 }

    expect(useArrayDifference([first, second], [{ [key]: 2 }, third], key, { symmetric: true }).value)
      .toEqual([first, third])
  })

  it('should be defined', () => {
    expect(useArrayDifference).toBeDefined()
  })

  it('should return the difference of two array', () => {
    const list1 = deepRef([1, 2, 3, 4, 5])
    const list2 = deepRef([4, 5, 6])

    const result = useArrayDifference(list1, list2)
    expect(result.value).toEqual([1, 2, 3])

    list2.value = [1, 2, 3]
    expect(result.value).toEqual([4, 5])

    list1.value = [1, 2, 3]
    expect(result.value).toEqual([])
  })

  it('should return the difference of two array with iteratee', () => {
    const list1 = deepRef([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    const list2 = deepRef([{ id: 4 }, { id: 5 }])

    const result = useArrayDifference(list1, list2, (value, othVal) => value.id === othVal.id)
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])

    list2.value = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(result.value).toEqual([{ id: 4 }, { id: 5 }])

    list1.value = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(result.value).toEqual([])
  })

  // key
  it('should return the difference of two array with key', () => {
    const list1 = deepRef([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    const list2 = deepRef([{ id: 3 }, { id: 4 }, { id: 5 }])

    const result = useArrayDifference(list1, list2, 'id')
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }])

    list2.value = [{ id: 1 }, { id: 2 }]
    expect(result.value).toEqual([{ id: 3 }, { id: 4 }, { id: 5 }])

    list1.value = [{ id: 1 }, { id: 2 }]
    expect(result.value).toEqual([])
  })

  it('symmetric diff case 1', () => {
    const list1 = deepRef([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    const list2 = deepRef([{ id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }])

    const result = useArrayDifference(list1, list2, 'id', { symmetric: true })
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }, { id: 6 }])

    list2.value = [{ id: 1 }, { id: 2 }]
    expect(result.value).toEqual([{ id: 3 }, { id: 4 }, { id: 5 }])

    list1.value = [{ id: 1 }, { id: 2 }]
    expect(result.value).toEqual([])
  })

  it('symmetric diff case 2', () => {
    const list1 = deepRef([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    const list2 = deepRef([{ id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }])

    const result = useArrayDifference(list1, list2, (x, y) => x.id === y.id, { symmetric: true })
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }, { id: 6 }])

    list2.value = [{ id: 6 }, { id: 7 }]
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }])

    list1.value = [{ id: 6 }, { id: 7 }]
    expect(result.value).toEqual([])
  })
})
