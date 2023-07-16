import type { Awaitable, MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'
import type { UnwrapNestedRefs } from 'vue-demi'
import { computed, nextTick, reactive, ref, watch } from 'vue-demi'
import { useElementVisibility } from '../useElementVisibility'
import type { UseScrollOptions } from '../useScroll'
import { useScroll } from '../useScroll'

export interface UseInfiniteScrollOptions extends UseScrollOptions {
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
}

/**
 * Reactive infinite scroll.
 *
 * @see https://vueuse.org/useInfiniteScroll
 */
export function useInfiniteScroll(
  element: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>,
  onLoadMore: (state: UnwrapNestedRefs<ReturnType<typeof useScroll>>) => Awaitable<void>,
  options: UseInfiniteScrollOptions = {},
) {
  const {
    direction = 'bottom',
    interval = 100,
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

  const promise = ref<any>()
  const isLoading = computed(() => !!promise.value)
  // Document and Window cannot be observed by IntersectionObserver
  const observerElement = computed(() => {
    const el = toValue(element)
    if (el instanceof Window)
      return window.document.documentElement

    if (el instanceof Document)
      return document.documentElement

    return el
  })
  const isElementVisible = useElementVisibility(observerElement)

  function checkAndLoad() {
    state.measure()

    if (!observerElement.value || !isElementVisible.value)
      return

    const isNarrower = (direction === 'bottom' || direction === 'top')
      ? observerElement.value.scrollHeight <= observerElement.value.clientHeight
      : observerElement.value.scrollWidth <= observerElement.value.clientWidth

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

  watch(
    () => [state.arrivedState[direction], isElementVisible.value],
    (newState) => {
      checkAndLoad()
    },
    { immediate: true },
  )

  return {
    isLoading,
  }
}
