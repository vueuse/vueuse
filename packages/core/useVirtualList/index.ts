import type { ComputedRef, MaybeRef, Ref, ShallowRef, StyleValue } from 'vue'
import { computed, ref as deepRef, shallowRef, watch } from 'vue'
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

export interface UseVirtualListScrollToOptions { behavior?: ScrollBehavior, block?: ScrollLogicalPosition, inline?: ScrollLogicalPosition }

export interface UseVirtualListReturn<T> {
  list: Ref<UseVirtualListItem<T>[]>
  scrollTo: (index: number, options?: UseVirtualListScrollToOptions) => void

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
export function useVirtualList<T = any>(list: MaybeRef<readonly T[]>, options: UseVirtualListOptions): UseVirtualListReturn<T> {
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

type UseVirtualListSource<T> = Ref<readonly T[]> | ShallowRef<readonly T[]>

interface UseVirtualListState { start: number, end: number }

type RefState = Ref<UseVirtualListState>

interface UseVirtualListResources<T> {
  state: RefState
  source: UseVirtualListSource<T>
  currentList: UseVirtualListRefArray<T>
  size: UseVirtualElementSizes
  containerRef: UseVirtualListContainerRef
}

function useVirtualListResources<T>(list: MaybeRef<readonly T[]>): UseVirtualListResources<T> {
  const containerRef = shallowRef<HTMLElement | null>(null)
  const size = useElementSize(containerRef)

  const currentList: Ref<UseVirtualListItem<T>[]> = deepRef([])
  const source = shallowRef(list)

  const state: Ref<{ start: number, end: number }> = deepRef({ start: 0, end: 10 })

  return { state, source, currentList, size, containerRef }
}

function createGetViewCapacity<T>(state: UseVirtualListResources<T>['state'], source: UseVirtualListResources<T>['source'], itemSize: UseVirtualListItemSize) {
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

function createGetOffset<T>(source: UseVirtualListResources<T>['source'], itemSize: UseVirtualListItemSize) {
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

function createCalculateRange<T>(type: 'horizontal' | 'vertical', overscan: number, getOffset: ReturnType<typeof createGetOffset>, getViewCapacity: ReturnType<typeof createGetViewCapacity>, { containerRef, state, currentList, source }: UseVirtualListResources<T>) {
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

function createGetDistance<T>(itemSize: UseVirtualListItemSize, source: UseVirtualListResources<T>['source']) {
  return (index: number) => {
    if (typeof itemSize === 'number') {
      const size = index * itemSize
      return size
    }

    const size = source.value
      .slice(0, index)
      .reduce((sum, _, i) => sum + itemSize(i), 0)

    return size
  }
}

function useWatchForSizes<T>(size: UseVirtualElementSizes, listRef: Ref<readonly T[]>, containerRef: Ref<HTMLElement | null>, calculateRange: () => void) {
  watch([size.width, size.height, listRef, containerRef], () => {
    calculateRange()
  })
}

function createComputedTotalSize<T>(itemSize: UseVirtualListItemSize, source: UseVirtualListResources<T>['source']) {
  return computed(() => {
    if (typeof itemSize === 'number')
      return source.value.length * itemSize

    return source.value.reduce((sum, _, index) => sum + itemSize(index), 0)
  })
}

const scrollToDictionaryForElementScrollKey = {
  horizontal: 'scrollLeft',
  vertical: 'scrollTop',
} as const

const scrollToDictionaryForElementScrollToKey = {
  horizontal: 'left',
  vertical: 'top',
} as const

const defaultScrollToOptions: UseVirtualListScrollToOptions = { behavior: 'auto', block: 'start', inline: 'nearest' }

function createScrollTo<T>(type: 'horizontal' | 'vertical', calculateRange: () => void, getDistance: ReturnType<typeof createGetDistance>, containerRef: UseVirtualListResources<T>['containerRef'], itemSize: UseVirtualListItemSize) {
  return (index: number, options: UseVirtualListScrollToOptions = defaultScrollToOptions) => {
    if (!containerRef.value)
      return

    options = {...defaultScrollToOptions, ...options}
    let offset = 0
    const axisToCheck = options[type === 'horizontal' ? 'inline' : 'block']
    if (axisToCheck) {
      const containerSize = type === 'horizontal' ? containerRef.value.clientWidth : containerRef.value.clientHeight
      const fullItemSize = typeof itemSize === 'number' ? itemSize : itemSize(index)

      if (axisToCheck === 'center') {
        offset = (containerSize / 2) - (fullItemSize / 2)
      }
      else if (axisToCheck === 'end') {
        offset = containerSize - fullItemSize
      }
      else if (axisToCheck === 'nearest') {
        const containerScrollPosition = containerRef.value[scrollToDictionaryForElementScrollKey[type]]
        if (getDistance(index) > containerScrollPosition + (containerSize / 2)) {
          offset = containerSize - fullItemSize
        }
      }
    }

    containerRef.value.scrollTo({
      [scrollToDictionaryForElementScrollToKey[type]]: getDistance(index) - offset,
      behavior: options.behavior,
    })

    calculateRange()
  }
}

function useHorizontalVirtualList<T>(options: UseHorizontalVirtualListOptions, list: MaybeRef<readonly T[]>) {
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

  useWatchForSizes(size, source, containerRef, calculateRange)

  const scrollTo = createScrollTo('horizontal', calculateRange, getDistanceLeft, containerRef, itemWidth)

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

function useVerticalVirtualList<T>(options: UseVerticalVirtualListOptions, list: MaybeRef<readonly T[]>) {
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

  useWatchForSizes(size, source, containerRef, calculateRange)

  const scrollTo = createScrollTo('vertical', calculateRange, getDistanceTop, containerRef, itemHeight)

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
