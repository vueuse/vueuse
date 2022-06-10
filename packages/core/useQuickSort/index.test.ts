import { unref } from 'vue'
import { useQuickSort } from '.'

describe('useQuickSort', () => {
  const arr = [10, 3, 5, 7, 2, 1, 8, 6, 9, 4]

  it('should be defined', () => {
    expect(useQuickSort).toBeDefined()
  })

  it('should sort', () => {
    const sorted = useQuickSort(arr)
    expect(unref(sorted)).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('should pure sort function', () => {
    const sorted = useQuickSort(arr)
    expect(unref(sorted)).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('should dirty sort', () => {
    const dirtyArr = [...arr]
    const sorted = useQuickSort(dirtyArr, { dirty: true })
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
    const sorted = useQuickSort(objArr, {
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
