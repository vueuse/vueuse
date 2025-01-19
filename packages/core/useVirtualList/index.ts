import type { MaybeRef } from '@vueuse/shared'
import type { ComputedRef, Ref, ShallowRef, StyleValue } from 'vue'
import { computed, ref, shallowRef, watch } from 'vue'
import { useElementSize } from '../useElementSize'

type UseVirtualListItemSize = number | ((index: number) => number)

export interface UseHorizontalVirtualListOptions extends UseVirtualListOptionsBase {

  /**
   * item width, accept a pixel value or a function that returns the width
   *
   * @default 0
   */
  itemWidth: UseVirtualListItemSize

}

export interface UseVerticalVirtualListOptions extends UseVirtualListOptionsBase {
  /**
   * item height, accept a pixel value or a function that returns the height
   *
   * @default 0
   */
  itemHeight: UseVirtualListItemSize
}

export interface UseVirtualListOptionsBase {
  /**
   * the extra buffer items outside of the view area
   *
   * @default 5
   */
  overscan?: number
}

export type UseVirtualListOptions = UseHorizontalVirtualListOptions | UseVerticalVirtualListOptions

export interface UseVirtualListItem<T> {
  data: T
  index: number
}

export interface UseVirtualListReturn<T> {
  list: Ref<UseVirtualListItem<T>[]>
  scrollTo: (index: number) => void

  containerProps: {
    ref: Ref<HTMLElement | null>
    onScroll: () => void
    style: StyleValue
  }
  wrapperProps: ComputedRef<{
    style: {
      width: string
      height: string
      marginTop: string
    } | {
      width: string
      height: string
      marginLeft: string
      display: string
    }
  }>
}

/**
 * Please consider using [`vue-virtual-scroller`](https://github.com/Akryum/vue-virtual-scroller) if you are looking for more features.
 */
export function useVirtualList<Ts extends readonly unknown[] = any[]>(list: MaybeRef<Ts>, options: UseVirtualListOptions): UseVirtualListReturn<Ts[number]> {
  const { containerStyle, wrapperProps, scrollTo, calculateRange, currentList, containerRef } = 'itemHeight' in options
    ? useVerticalVirtualList(options, list)
    : useHorizontalVirtualList(options, list)

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

type UseVirtualListContainerRef = Ref<HTMLElement | null>

interface UseVirtualElementSizes {
  width: Ref<number>
  height: Ref<number>
}

type UseVirtualListArray<T> = UseVirtualListItem<T>[]
type UseVirtualListRefArray<T> = Ref<UseVirtualListArray<T>>

type UseVirtualListSource<Ts extends readonly unknown[]> = Ref<Ts> | ShallowRef<Ts>

interface UseVirtualListState { start: number, end: number }

type RefState = Ref<UseVirtualListState>

interface UseVirtualListResources<Ts extends readonly unknown[]> {
  state: RefState
  source: UseVirtualListSource<Ts>
  currentList: UseVirtualListRefArray<Ts[number]>
  size: UseVirtualElementSizes
  containerRef: UseVirtualListContainerRef
}

function useVirtualListResources<Ts extends readonly unknown[]>(list: MaybeRef<Ts>): UseVirtualListResources<Ts> {
  const containerRef = ref<HTMLElement | null>(null)
  const size = useElementSize(containerRef)

  const currentList: Ref<UseVirtualListItem<Ts[number]>[]> = ref([])
  const source = shallowRef(list) as ShallowRef<Ts>

  const state: Ref<{ start: number, end: number }> = ref({ start: 0, end: 10 })

  return { state, source, currentList, size, containerRef }
}

function createGetViewCapacity<Ts extends readonly unknown[]>(state: UseVirtualListResources<Ts>['state'], source: UseVirtualListResources<Ts>['source'], itemSize: UseVirtualListItemSize) {
  return (containerSize: number) => {
    if (typeof itemSize === 'number')
      return Math.ceil(containerSize / itemSize)

    const { start = 0 } = state.value
    let sum = 0
    let capacity = 0
    for (let i = start; i < source.value.length; i++) {
      const size = itemSize(i)
      sum += size
      capacity = i
      if (sum > containerSize)
        break
    }
    return capacity - start
  }
}

function createGetOffset<Ts extends readonly unknown[]>(source: UseVirtualListResources<Ts>['source'], itemSize: UseVirtualListItemSize) {
  return (scrollDirection: number) => {
    if (typeof itemSize === 'number')
      return Math.floor(scrollDirection / itemSize) + 1

    let sum = 0
    let offset = 0

    for (let i = 0; i < source.value.length; i++) {
      const size = itemSize(i)
      sum += size
      if (sum >= scrollDirection) {
        offset = i
        break
      }
    }
    return offset + 1
  }
}

function createCalculateRange<Ts extends readonly unknown[]>(type: 'horizontal' | 'vertical', overscan: number, getOffset: ReturnType<typeof createGetOffset>, getViewCapacity: ReturnType<typeof createGetViewCapacity>, { containerRef, state, currentList, source }: UseVirtualListResources<Ts>) {
  return () => {
    const element = containerRef.value
    if (element) {
      const offset = getOffset(type === 'vertical' ? element.scrollTop : element.scrollLeft)
      const viewCapacity = getViewCapacity(type === 'vertical' ? element.clientHeight : element.clientWidth)

      const from = offset - overscan
      const to = offset + viewCapacity + overscan
      state.value = {
        start: from < 0 ? 0 : from,
        end: to > source.value.length
          ? source.value.length
          : to,
      }
      currentList.value = source.value
        .slice(state.value.start, state.value.end)
        .map((ele, index) => ({
          data: ele,
          index: index + state.value.start,
        }))
    }
  }
}

function createGetDistance<Ts extends readonly unknown[]>(itemSize: UseVirtualListItemSize, source: UseVirtualListResources<Ts>['source']) {
  return (index: number) => {
    if (typeof itemSize === 'number') {
      const size = index * itemSize
      return size
    }

    const size = source.value
      .slice(0, index)
      .reduce<number>((sum, _, i) => sum + itemSize(i), 0)

    return size
  }
}

function useWatchForSizes<Ts extends readonly unknown[]>(size: UseVirtualElementSizes, list: MaybeRef<Ts>, containerRef: Ref<HTMLElement | null>, calculateRange: () => void) {
  watch([size.width, size.height, list, containerRef], () => {
    calculateRange()
  })
}

function createComputedTotalSize<Ts extends readonly unknown[]>(itemSize: UseVirtualListItemSize, source: UseVirtualListResources<Ts>['source']) {
  return computed(() => {
    if (typeof itemSize === 'number')
      return source.value.length * itemSize

    return source.value.reduce<number>((sum, _, index) => sum + itemSize(index), 0)
  })
}

const scrollToDictionaryForElementScrollKey = {
  horizontal: 'scrollLeft',
  vertical: 'scrollTop',
} as const

function createScrollTo<Ts extends readonly unknown[]>(type: 'horizontal' | 'vertical', calculateRange: () => void, getDistance: ReturnType<typeof createGetDistance>, containerRef: UseVirtualListResources<Ts>['containerRef']) {
  return (index: number) => {
    if (containerRef.value) {
      containerRef.value[scrollToDictionaryForElementScrollKey[type]] = getDistance(index)
      calculateRange()
    }
  }
}

function useHorizontalVirtualList<Ts extends readonly unknown[]>(options: UseHorizontalVirtualListOptions, list: MaybeRef<Ts>) {
  const resources = useVirtualListResources(list)
  const { state, source, currentList, size, containerRef } = resources
  const containerStyle: StyleValue = { overflowX: 'auto' }

  const { itemWidth, overscan = 5 } = options

  const getViewCapacity = createGetViewCapacity(state, source, itemWidth)

  const getOffset = createGetOffset(source, itemWidth)

  const calculateRange = createCalculateRange('horizontal', overscan, getOffset, getViewCapacity, resources)

  const getDistanceLeft = createGetDistance(itemWidth, source)

  const offsetLeft = computed(() => getDistanceLeft(state.value.start))

  const totalWidth = createComputedTotalSize(itemWidth, source)

  useWatchForSizes(size, list, containerRef, calculateRange)

  const scrollTo = createScrollTo('horizontal', calculateRange, getDistanceLeft, containerRef)

  const wrapperProps = computed(() => {
    return {
      style: {
        height: '100%',
        width: `${totalWidth.value - offsetLeft.value}px`,
        marginLeft: `${offsetLeft.value}px`,
        display: 'flex',
      },
    }
  })

  return {
    scrollTo,
    calculateRange,
    wrapperProps,
    containerStyle,
    currentList,
    containerRef,
  }
}

function useVerticalVirtualList<Ts extends readonly unknown[]>(options: UseVerticalVirtualListOptions, list: MaybeRef<Ts>) {
  const resources = useVirtualListResources(list)

  const { state, source, currentList, size, containerRef } = resources

  const containerStyle: StyleValue = { overflowY: 'auto' }

  const { itemHeight, overscan = 5 } = options

  const getViewCapacity = createGetViewCapacity(state, source, itemHeight)

  const getOffset = createGetOffset(source, itemHeight)

  const calculateRange = createCalculateRange('vertical', overscan, getOffset, getViewCapacity, resources)

  const getDistanceTop = createGetDistance(itemHeight, source)

  const offsetTop = computed(() => getDistanceTop(state.value.start))

  const totalHeight = createComputedTotalSize(itemHeight, source)

  useWatchForSizes(size, list, containerRef, calculateRange)

  const scrollTo = createScrollTo('vertical', calculateRange, getDistanceTop, containerRef)

  const wrapperProps = computed(() => {
    return {
      style: {
        width: '100%',
        height: `${totalHeight.value - offsetTop.value}px`,
        marginTop: `${offsetTop.value}px`,
      },
    }
  })

  return {
    calculateRange,
    scrollTo,
    containerStyle,
    wrapperProps,
    currentList,
    containerRef,
  }
}
