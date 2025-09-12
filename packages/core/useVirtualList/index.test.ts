import { describe, expect, it } from 'vitest'
import { ref as deepRef } from 'vue'
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
})
