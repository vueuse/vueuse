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
    } = useVirtualList(ref(['a', 'b', 'c']), { itemHeight: () => 50, overscan: 0 })
    const div = { ...document.createElement('div'), clientHeight: 120 }

    containerRef.value = div
    scrollTo(0)
    expect(list.value.length).toEqual(2)

    containerRef.value = { ...div, clientHeight: 150 }
    scrollTo(0)
    expect(list.value.length).toEqual(3)

    containerRef.value = { ...div, clientHeight: 160 }
    scrollTo(0)
    expect(list.value.length).toEqual(3)
  })

  it('returns the current visible window of items if there are too many for the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c', 'd', 'e']), { itemHeight: () => 50, overscan: 0 })
    const div = { ...document.createElement('div'), clientHeight: 150 }

    containerRef.value = div

    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c'])

    scrollTo(1)
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd'])

    scrollTo(2)
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e'])
  })

  it('returns window with overscan', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c', 'd', 'e', 'f']), { itemHeight: () => 50, overscan: 1 })
    const div = { ...document.createElement('div'), clientHeight: 100 }

    containerRef.value = div

    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c'])

    scrollTo(1)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd'])

    scrollTo(2)
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd', 'e'])

    scrollTo(3)
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e', 'f'])
  })
})

describe('useVirtualList, horizontal', () => {
  it('returns all original items if they fit the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c']), { itemWidth: () => 50, overscan: 0 })
    const div = {
      ...document.createElement('div'),
      clientWidth: 120,
    }

    containerRef.value = div
    scrollTo(0)
    expect(list.value.length).toEqual(2)

    containerRef.value = { ...div, clientWidth: 150 }
    scrollTo(0)
    expect(list.value.length).toEqual(3)

    containerRef.value = { ...div, clientWidth: 160 }
    scrollTo(0)
    expect(list.value.length).toEqual(3)
  })

  it('returns the current visible window of items if there are too many for the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c', 'd', 'e']), { itemWidth: () => 50, overscan: 0 })
    const div = { ...document.createElement('div'), clientWidth: 150 }

    containerRef.value = div

    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c'])

    scrollTo(1)
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd'])

    scrollTo(2)
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e'])
  })

  it('returns window with overscan', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(ref(['a', 'b', 'c', 'd', 'e', 'f']), { itemWidth: () => 50, overscan: 1 })
    const div = { ...document.createElement('div'), clientWidth: 100 }

    containerRef.value = div

    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c'])

    scrollTo(1)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd'])

    scrollTo(2)
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd', 'e'])

    scrollTo(3)
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e', 'f'])
  })
})
