import { unref } from 'vue'
import { quickSort } from '../useQuickSort'
import { useSort, useSortWrapFn } from '.'

interface User {
  name: string
  age: number
}

const arr = [10, 3, 5, 7, 2, 1, 8, 6, 9, 4]
const arrSorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const objArr: User[] = [
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
const objectSorted: User[] = [
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
]

describe('useSort', () => {
  it('should be defined', () => {
    expect(useSort).toBeDefined()
  })

  it('should sort', () => {
    const sorted = useSort(arr, quickSort)
    expect(unref(sorted)).toMatchObject(arrSorted)
  })

  it('should pure sort function', () => {
    const sorted = useSort(arr, quickSort)
    expect(unref(sorted)).toMatchObject(arrSorted)
  })

  it('should dirty sort', () => {
    const dirtyArr = [...arr]
    const sorted = useSort(dirtyArr, quickSort, { dirty: true })

    expect(unref(sorted)).toMatchObject(arrSorted)
    expect(unref(dirtyArr)).toMatchObject(arrSorted)
  })

  it('should sort object', () => {
    const sorted = useSort(objArr, quickSort, {
      compareFn: (a, b) => a.age - b.age,
    })

    expect(unref(sorted)).toMatchObject(objectSorted)
  })

  it('should wrap function', () => {
    const wrapFn = useSortWrapFn(quickSort)
    const sorted = wrapFn(objArr, {
      compareFn: (a, b) => a.age - b.age,
    })

    expect(unref(sorted)).toMatchObject(objectSorted)
  })

  it('should wrap function with options', () => {
    const wrapFn = useSortWrapFn<User>(quickSort, {
      compareFn: (a, b) => a.age - b.age,
    })
    const sorted = wrapFn(objArr)

    expect(unref(sorted)).toMatchObject(objectSorted)
  })
})
