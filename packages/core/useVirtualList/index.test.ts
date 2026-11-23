import { describe, expect, it } from 'vitest'
import { ref as deepRef, nextTick } from 'vue'
import { useVirtualList } from './index'

function createDiv(properties: Partial<HTMLElement>) {
  return {
    ...document.createElement('div'),
    ...properties,
    scrollTo(options?: ScrollToOptions | number) {
      if (typeof options === 'object') {
        if (options.top) {
          this.scrollTop = options.top
        }
        if (options.left) {
          this.scrollLeft = options.left
        }
      }
    },
  }
}

describe('useVirtualList', () => {
  it('should be defined', () => {
    expect(useVirtualList).toBeDefined()
  })

  it('should accept plain arrays as input', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(['a', 'b', 'c', 'd', 'e', 'f'], { itemHeight: () => 50 })
    const div = createDiv({ clientHeight: 100 })

    containerRef.value = div
    scrollTo(0)
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  it.each(['vertical', 'horizontal'] as const)('measures the filtered %s viewport from its current offset', async (direction) => {
    const source = deepRef(Array.from({ length: 100 }, (_, index) => index < 5 ? 10 : 50))
    const itemSize = (index: number) => source.value[index]
    const options = direction === 'vertical' ? { itemHeight: itemSize } : { itemWidth: itemSize }
    const { list, containerProps, wrapperProps } = useVirtualList(source, { ...options, overscan: 0 })
    const div = createDiv({
      clientHeight: 100,
      clientWidth: 100,
      scrollTop: 4000,
      scrollLeft: 4000,
    })
    containerProps.ref.value = div
    await nextTick()

    source.value = source.value.slice(0, 20)
    await nextTick()

    expect(list.value).toEqual([
      { data: 50, index: 18 },
      { data: 50, index: 19 },
    ])
    expect(wrapperProps.value.style).toMatchObject(direction === 'vertical'
      ? { marginTop: '700px', height: '100px' }
      : { marginLeft: '700px', width: '100px' })
  })
})

describe.each([
  ['vertical', 'fixed', { itemHeight: 20 }],
  ['vertical', 'variable', { itemHeight: () => 20 }],
  ['horizontal', 'fixed', { itemWidth: 20 }],
  ['horizontal', 'variable', { itemWidth: () => 20 }],
] as const)('useVirtualList, %s with %s sizes', (direction, _size, options) => {
  const scrollKey = direction === 'vertical' ? 'scrollTop' : 'scrollLeft'
  const marginKey = direction === 'vertical' ? 'marginTop' : 'marginLeft'
  const sizeKey = direction === 'vertical' ? 'height' : 'width'

  function createScrolledList() {
    const source = deepRef(Array.from({ length: 100 }, (_, index) => index))
    const result = useVirtualList(source, options)
    const div = createDiv({
      clientHeight: 100,
      clientWidth: 100,
      scrollTop: 1800,
      scrollLeft: 1800,
    })
    result.containerProps.ref.value = div
    return { source, div, ...result }
  }

  it('renders filtered results that fit the viewport after scrolling near the end', async () => {
    const { source, div, list, wrapperProps } = createScrolledList()
    await nextTick()
    expect(list.value.length).toBeGreaterThan(0)

    source.value = [101, 102, 103]
    await nextTick()

    expect(list.value).toEqual([
      { data: 101, index: 0 },
      { data: 102, index: 1 },
      { data: 103, index: 2 },
    ])
    expect(div[scrollKey]).toBe(0)
    expect(wrapperProps.value.style).toMatchObject({
      [marginKey]: '0px',
      [sizeKey]: '60px',
    })
  })

  it('keeps the last viewport visible when the shortened list still overflows', async () => {
    const { source, div, list, wrapperProps } = createScrolledList()
    await nextTick()

    source.value = source.value.slice(0, 20)
    await nextTick()

    expect(div[scrollKey]).toBe(300)
    expect(list.value.map(item => item.data)).toEqual(expect.arrayContaining([15, 16, 17, 18, 19]))
    expect(list.value.every(item => item.index >= 0 && item.index < 20)).toBe(true)
    const style = wrapperProps.value.style
    const margin = 'marginTop' in style ? style.marginTop : style.marginLeft
    expect(Number.parseFloat(margin) + Number.parseFloat(style[sizeKey])).toBe(400)
  })

  it('retains a scroll position that is still valid after filtering', async () => {
    const { source, div, list } = createScrolledList()
    await nextTick()
    const firstIndex = list.value[0].index

    source.value = source.value.slice(0, 95)
    await nextTick()

    expect(div[scrollKey]).toBe(1800)
    expect(list.value[0].index).toBe(firstIndex)
    expect(list.value.map(item => item.data).slice(-5)).toEqual([90, 91, 92, 93, 94])
  })

  it('recovers after filtering to an empty list and restoring results', async () => {
    const { source, div, list, wrapperProps } = createScrolledList()
    await nextTick()

    source.value = []
    await nextTick()

    expect(list.value).toEqual([])
    expect(div[scrollKey]).toBe(0)
    expect(wrapperProps.value.style).toMatchObject({
      [marginKey]: '0px',
      [sizeKey]: '0px',
    })

    source.value = [101, 102, 103]
    await nextTick()

    expect(list.value.map(item => item.data)).toEqual([101, 102, 103])
  })
})

describe('useVirtualList, vertical', () => {
  it('returns all original items if they fit the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(deepRef(['a', 'b', 'c', 'd', 'e', 'f']), { itemHeight: () => 50, overscan: 1 })
    const div = createDiv({ clientHeight: 50 })

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
    } = useVirtualList(deepRef(['a', 'b', 'c', 'd', 'e', 'f', 'g']), { itemHeight: () => 50, overscan: 1 })
    const div = createDiv({ clientHeight: 50 })

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

  it('correctly uses the scrollTo block option to align inside the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(deepRef(['a', 'b', 'c', 'd', 'e', 'f', 'g']), { itemHeight: () => 50, overscan: 1 })
    const div = createDiv({ clientHeight: 140 })

    containerRef.value = div

    scrollTo(0, { block: 'start' })
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd'])

    scrollTo(3, { block: 'start' })
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e', 'f'])

    scrollTo(3, { block: 'center' })
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e', 'f'])

    scrollTo(3, { block: 'end' })
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd', 'e'])

    containerRef.value.scrollTop = 1500
    scrollTo(3, { block: 'nearest' })
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e', 'f'])

    containerRef.value.scrollTop = 0
    scrollTo(3, { block: 'nearest' })
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd', 'e'])
  })

  it('recomputes the visible range when a reactive item height changes without scrolling', async () => {
    const itemHeight = deepRef(50)
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(deepRef(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']), { itemHeight: () => itemHeight.value, overscan: 1 })
    const div = createDiv({ clientHeight: 100 })

    containerRef.value = div
    scrollTo(0)
    // Let the element-size observer settle so the item-height change below is
    // the only thing that can trigger a recalculation.
    await nextTick()
    await nextTick()
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd'])

    // Shrinking the items makes more of them fit; the range must update even
    // though neither the source nor the container size changed and no scroll
    // event occurred.
    itemHeight.value = 25
    await nextTick()
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })
})

describe('useVirtualList, horizontal', () => {
  it('returns all original items if they fit the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(deepRef(['a', 'b', 'c', 'd', 'e', 'f']), { itemWidth: () => 50, overscan: 1 })
    const div = createDiv({ clientWidth: 50 })

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
    } = useVirtualList(deepRef(['a', 'b', 'c', 'd', 'e', 'f', 'g']), { itemWidth: () => 50, overscan: 1 })
    const div = createDiv({ clientWidth: 50 })

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

  it('correctly uses the scrollTo inline option to align inside the container', () => {
    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(deepRef(['a', 'b', 'c', 'd', 'e', 'f', 'g']), { itemWidth: () => 50, overscan: 1 })
    const div = createDiv({ clientWidth: 140 })

    containerRef.value = div

    scrollTo(0, { inline: 'start' })
    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd'])

    scrollTo(3, { inline: 'start' })
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e', 'f'])

    scrollTo(3, { inline: 'center' })
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e', 'f'])

    scrollTo(3, { inline: 'end' })
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd', 'e'])

    containerRef.value.scrollLeft = 1500
    scrollTo(3, { inline: 'nearest' })
    expect(list.value.map(i => i.data)).toEqual(['c', 'd', 'e', 'f'])

    containerRef.value.scrollLeft = 0
    scrollTo(3, { inline: 'nearest' })
    expect(list.value.map(i => i.data)).toEqual(['b', 'c', 'd', 'e'])
  })

  it('allows both readonly and mutable arrays as input', () => {
    const mutableInput: string[] = ['a', 'b', 'c', 'd', 'e', 'f']
    const readonlyInput: readonly string[] = ['a', 'b', 'c', 'd', 'e', 'f']

    const {
      list: readonlyList,
    } = useVirtualList(deepRef(readonlyInput), { itemHeight: () => 50, overscan: 1 })
    const {
      list: mutableList,
    } = useVirtualList(deepRef(mutableInput), { itemHeight: () => 50, overscan: 1 })

    expect(readonlyList.value).toBeDefined()
    expect(mutableList.value).toBeDefined()
  })

  it('reacts to changes in a source ref when mutated if no size changes are made to the container', async () => {
    const mutableInput = deepRef(['a', 'b'])

    const {
      list,
      containerProps: { ref: containerRef },
      scrollTo,
    } = useVirtualList(mutableInput, { itemHeight: () => 10 })

    const div = createDiv({ clientHeight: 100 })
    containerRef.value = div
    scrollTo(0)

    expect(list.value.map(i => i.data)).toEqual(['a', 'b'])

    mutableInput.value.push('c', 'd')
    await nextTick()

    expect(list.value.map(i => i.data)).toEqual(['a', 'b', 'c', 'd'])
  })
})
