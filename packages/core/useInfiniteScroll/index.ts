import type { Awaitable } from '@vueuse/shared'
import type { MaybeRefOrGetter, UnwrapNestedRefs } from 'vue'
import type { UseScrollOptions } from '../useScroll'
import { tryOnUnmounted } from '@vueuse/shared'
import { computed, ref as deepRef, nextTick, reactive, toValue, watch } from 'vue'
import { resolveElement } from '../_resolve-element'
import { useElementVisibility } from '../useElementVisibility'
import { useScroll } from '../useScroll'

type InfiniteScrollElement = HTMLElement | SVGElement | Window | Document | null | undefined

export interface UseInfiniteScrollOptions<T extends InfiniteScrollElement = InfiniteScrollElement> extends UseScrollOptions {
  /**
   * The minimum distance between the bottom of the element and the bottom of the viewport
   *
   * @default 0
   */
  distance?: number

  /**
   * The direction in which to listen the scroll.
   *
   * @default 'bottom'
   */
  direction?: 'top' | 'bottom' | 'left' | 'right'

  /**
   * The interval time between two load more (to avoid too many invokes).
   *
   * @default 100
   */
  interval?: number

  /**
   * A function that determines whether more content can be loaded for a specific element.
   * Should return `true` if loading more content is allowed for the given element,
   * and `false` otherwise.
   */
  canLoadMore?: (el: T) => boolean
}

/**
 * Reactive infinite scroll.
 *
 * @see https://vueuse.org/useInfiniteScroll
 */
export function useInfiniteScroll<T extends InfiniteScrollElement>(
  element: MaybeRefOrGetter<T>,
  onLoadMore: (state: UnwrapNestedRefs<ReturnType<typeof useScroll>>) => Awaitable<void>,
  options: UseInfiniteScrollOptions<T> = {},
) {
  const {
    direction = 'bottom',
    interval = 100,
    canLoadMore = () => true,
  } = options

  const state = reactive(useScroll(
    element,
    {
      ...options,
      offset: {
        [direction]: options.distance ?? 0,
        ...options.offset,
      },
    },
  ))

  const promise = deepRef<any>()
  const isLoading = computed(() => !!promise.value)

  // Document and Window cannot be observed by IntersectionObserver
  const observedElement = computed<HTMLElement | SVGElement | null | undefined>(() => {
    return resolveElement(toValue(element))
  })

  const isElementVisible = useElementVisibility(observedElement)

  function checkAndLoad() {
    state.measure()

    if (!observedElement.value || !isElementVisible.value || !canLoadMore(observedElement.value as T))
      return

    const { scrollHeight, clientHeight, scrollWidth, clientWidth } = observedElement.value as HTMLElement
    const isNarrower = (direction === 'bottom' || direction === 'top')
      ? scrollHeight <= clientHeight
      : scrollWidth <= clientWidth

    if (state.arrivedState[direction] || isNarrower) {
      if (!promise.value) {
        promise.value = Promise.all([
          onLoadMore(state),
          new Promise(resolve => setTimeout(resolve, interval)),
        ])
          .finally(() => {
            promise.value = null
            nextTick(() => checkAndLoad())
          })
      }
    }
  }

  const stop = watch(
    () => [state.arrivedState[direction], isElementVisible.value],
    checkAndLoad,
    { immediate: true },
  )

  tryOnUnmounted(stop)

  return {
    isLoading,
    reset() {
      nextTick(() => checkAndLoad())
    },
  }
}
