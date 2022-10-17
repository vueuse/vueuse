import { unref } from 'vue'
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
    expect(unref(sorted)).toMatchObject(arrSorted)
    expect(unref(arr)).toMatchInlineSnapshot(`
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

    expect(unref(sorted)).toMatchObject(arrSorted)
    expect(unref(dirtyArr)).toMatchObject(unref(sorted))
  })

  it('should sort object', () => {
    const sorted = useSorted(objArr, (a, b) => a.age - b.age)

    expect(unref(sorted)).toMatchObject(objectSorted)
  })

  it('should sort object by options.compareFn', () => {
    const sorted = useSorted(objArr, {
      compareFn: (a, b) => a.age - b.age,
    })

    expect(unref(sorted)).toMatchObject(objectSorted)
  })
})
