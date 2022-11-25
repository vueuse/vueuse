import { ref } from 'vue-demi'
import { useVirtualList } from '.'

describe('useVirtualList', () => {
  it('should be defined', () => {
    expect(useVirtualList).toBeDefined()
  })
})

describe('useVirtualList, vertical', () => {
  it('returns all original items if they fit the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c', 'd', 'e', 'f']), { itemHeight: () => 50, overscan: 1 })
    const div = { ...document.createElement('div'), clientHeight: 50 }

    containerRef.value = div

    containerRef.value = { ...div, clientHeight: 200 }
    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])

    containerRef.value = { ...div, clientHeight: 250 }
    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  it('returns the current visible window of items if there are too many for the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c', 'd', 'e', 'f', 'g']), { itemHeight: () => 50, overscan: 1 })
    const div = { ...document.createElement('div'), clientHeight: 50 }

    containerRef.value = div

    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c'])

    scrollTo(1)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c'])

    scrollTo(2)
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd'])

    scrollTo(3)
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e'])

    scrollTo(4)
    expect(list.value.map(i => i.data)).toEqual(['d', 'e', 'f'])

    scrollTo(5)
    expect(list.value.map(i => i.data)).toEqual(['e', 'f', 'g'])

    scrollTo(6)
    expect(list.value.map(i => i.data)).toEqual(['f', 'g'])
  })
})

describe('useVirtualList, horizontal', () => {
  it('returns all original items if they fit the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c', 'd', 'e', 'f']), { itemWidth: () => 50, overscan: 1 })
    const div = { ...document.createElement('div'), clientWidth: 50 }

    containerRef.value = div

    containerRef.value = { ...div, clientWidth: 200 }
    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])

    containerRef.value = { ...div, clientWidth: 250 }
    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  it('returns the current visible window of items if there are too many for the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c', 'd', 'e', 'f', 'g']), { itemWidth: () => 50, overscan: 1 })
    const div = { ...document.createElement('div'), clientWidth: 50 }

    containerRef.value = div

    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c'])

    scrollTo(1)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c'])

    scrollTo(2)
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd'])

    scrollTo(3)
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e'])

    scrollTo(4)
    expect(list.value.map(i => i.data)).toEqual(['d', 'e', 'f'])

    scrollTo(5)
    expect(list.value.map(i => i.data)).toEqual(['e', 'f', 'g'])

    scrollTo(6)
    expect(list.value.map(i => i.data)).toEqual(['f', 'g'])
  })
})
