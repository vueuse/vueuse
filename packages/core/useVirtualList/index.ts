import { watch, Ref, ref, computed } from 'vue-demi'
import { useElementSize } from '../useElementSize'

export interface UseVirtualListOptions {
  /**
   * item height, accept a pixel value or a function that returns the height
   *
   * @default 0
   */
  itemHeight: number | ((index: number) => number)
  /**
   * the extra buffer items outside of the view area
   *
   * @default 5
   */
  overscan?: number
}

export function useVirtualList <T = any>(list: T[], options: UseVirtualListOptions) {
  const containerRef: Ref = ref<HTMLElement | null>()
  const size = useElementSize(containerRef)
  const currentList: Ref = ref([])

  const state: Ref = ref({ start: 0, end: 10 })
  const { itemHeight, overscan = 5 } = options

  if (!itemHeight)
    console.warn('please enter a valid itemHeight')

  const getViewCapacity = (containerHeight: number) => {
    if (typeof itemHeight === 'number')
      return Math.ceil(containerHeight / itemHeight)

    const { start = 0 } = state.value
    let sum = 0
    let capacity = 0
    for (let i = start; i < list.length; i++) {
      const height = (itemHeight as (index: number) => number)(i)
      sum += height
      if (sum >= containerHeight) {
        capacity = i
        break
      }
    }
    return capacity - start
  }

  const getOffset = (scrollTop: number) => {
    if (typeof itemHeight === 'number')
      return Math.floor(scrollTop / itemHeight) + 1

    let sum = 0
    let offset = 0
    for (let i = 0; i < list.length; i++) {
      const height = (itemHeight as (index: number) => number)(i)
      sum += height
      if (sum >= scrollTop) {
        offset = i
        break
      }
    }
    return offset + 1
  }

  const calculateRange = () => {
    const element = containerRef.value
    if (element) {
      const offset = getOffset(element.scrollTop)
      const viewCapacity = getViewCapacity(element.clientHeight)

      const from = offset - overscan
      const to = offset + viewCapacity + overscan
      state.value = {
        start: from < 0 ? 0 : from,
        end: to > list.length ? list.length : to,
      }
      currentList.value = list.slice(state.value.start, state.value.end).map((ele, index) => ({
        data: ele,
        index: index + state.value.start,
      }))
    }
  }

  watch([size.width, size.height], () => {
    calculateRange()
  })

  const totalHeight = computed(() => {
    if (typeof itemHeight === 'number')
      return list.length * itemHeight

    return list.reduce((sum, _, index) => sum + itemHeight(index), 0)
  })

  const getDistanceTop = (index: number) => {
    if (typeof itemHeight === 'number') {
      const height = index * itemHeight
      return height
    }
    const height = list.slice(0, index).reduce((sum, _, i) => sum + itemHeight(i), 0)
    return height
  }

  const scrollTo = (index: number) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = getDistanceTop(index)
      calculateRange()
    }
  }

  const offsetTop = computed(() => getDistanceTop(state.value.start))
  const wrapperProps = computed(() => {
    return {
      style: {
        width: '100%',
        height: `${totalHeight.value - offsetTop.value}px`,
        marginTop: `${offsetTop.value}px`,
      },
    }
  })

  const containerStyle: Partial<CSSStyleDeclaration> = { overflowY: 'auto' }

  return {
    list: currentList,
    scrollTo,
    containerProps: {
      ref: containerRef,
      onScroll: () => {
        calculateRange()
      },
      style: containerStyle,
    },
    wrapperProps,
  }
}
