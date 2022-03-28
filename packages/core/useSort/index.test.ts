import { unref } from 'vue'
import { quickSort } from '../useQuickSort'
import { useSort } from '.'

describe('useSort', () => {
  const arr = [10, 3, 5, 7, 2, 1, 8, 6, 9, 4]

  it('should be defined', () => {
    expect(useSort).toBeDefined()
  })

  it('should sort', () => {
    const sorted = useSort(arr, quickSort)
    expect(unref(sorted)).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('should pure sort function', () => {
    const sorted = useSort(arr, quickSort)
    expect(unref(sorted)).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('should dirty sort', () => {
    const dirtyArr = [...arr]
    const sorted = useSort(dirtyArr, quickSort, { dirty: true })
    expect(unref(sorted)).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(unref(dirtyArr)).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('should sort object', () => {
    const objArr = [
      {
        name: 'John',
        age: 40,
      },
      {
        name: 'Jane',
        age: 20,
      },
      {
        name: 'Joe',
        age: 30,
      },
      {
        name: 'Jenny',
        age: 22,
      },
    ]
    const sorted = useSort(objArr, quickSort, {
      compareFn: (a, b) => a.age - b.age,
    })

    expect(unref(sorted)).toMatchObject([
      {
        name: 'Jane',
        age: 20,
      },
      {
        name: 'Jenny',
        age: 22,
      },
      {
        name: 'Joe',
        age: 30,
      },
      {
        name: 'John',
        age: 40,
      },
    ])
  })
})
