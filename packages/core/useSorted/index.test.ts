import { toValue } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { useSorted } from '.'

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

describe('useSorted', () => {
  it('should be defined', () => {
    expect(useSorted).toBeDefined()
  })

  it('should pure sort function', () => {
    const sorted = useSorted(arr)
    expect(toValue(sorted)).toMatchObject(arrSorted)
    expect(toValue(arr)).toMatchInlineSnapshot(`
      [
        10,
        3,
        5,
        7,
        2,
        1,
        8,
        6,
        9,
        4,
      ]
    `)
  })

  it('should dirty sort', () => {
    const dirtyArr = [...arr]
    const sorted = useSorted(dirtyArr, (a, b) => a - b, { dirty: true })

    expect(toValue(sorted)).toMatchObject(arrSorted)
    expect(toValue(dirtyArr)).toMatchObject(toValue(sorted))
  })

  it('should sort object', () => {
    const sorted = useSorted(objArr, (a, b) => a.age - b.age)

    expect(toValue(sorted)).toMatchObject(objectSorted)
  })

  it('should sort object by options.compareFn', () => {
    const sorted = useSorted(objArr, {
      compareFn: (a, b) => a.age - b.age,
    })

    expect(toValue(sorted)).toMatchObject(objectSorted)
  })
})
