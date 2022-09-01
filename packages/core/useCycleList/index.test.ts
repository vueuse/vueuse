import { useCycleList } from '.'

describe('useCycleList', () => {
  it('should be defined', () => {
    expect(useCycleList).toBeDefined()
  })

  it('should cycle [0, 1, 2, 0, 3, 4] orderly', () => {
    const listItems = [0, 1, 2, 0, 3, 4]
    const { state, next } = useCycleList(listItems)

    listItems.forEach((item) => {
      expect(state.value).toBe(item)
      next()
    })
  })

  it('should cycle [0, 1, 2, 0, 3, 4] with `initialValue` is 3 orderly', () => {
    const listItems = [0, 1, 2, 0, 3, 4]
    const expectedListItems = [3, 4, 0, 1, 2, 0]

    const { state, next } = useCycleList(listItems, { initialValue: 3 })

    expectedListItems.forEach((item) => {
      expect(state.value).toBe(item)
      next()
    })
  })

  it('should cycle list objects with `initialValue` and `getIndexOf` orderly', () => {
    const listItems = [{ name: 'Dog' }, { name: 'Cat' }, { name: 'Lizard' }]
    const expectedListItems = [{ name: 'Cat' }, { name: 'Lizard' }, { name: 'Dog' }]

    const { state, next } = useCycleList(listItems, {
      initialValue: { name: 'Cat' },
      getIndexOf: (cur, list) => list.findIndex(item => item.name === cur.name),
    })

    expectedListItems.forEach((item) => {
      expect(state.value).toMatchObject(item)
      next()
    })
  })
})
