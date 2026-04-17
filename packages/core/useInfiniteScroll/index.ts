import type { Awaitable } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter, UnwrapNestedRefs } from 'vue'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { UseScrollOptions, UseScrollReturn } from '../useScroll'
import { tryOnUnmounted } from '@vueuse/shared'
import { computed, nextTick, reactive, shallowRef, toValue, watch } from 'vue'
import { resolveElement } from '../_resolve-element'
import { useElementVisibility } from '../useElementVisibility'
import { useIntersectionObserver } from '../useIntersectionObserver'
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

  /**
   * The element to observe for triggering load more.
   * When provided, loading is triggered when this element
   * becomes visible instead of when the scroll container reaches its end.
   */
  trigger?: MaybeComputedElementRef
}

export interface UseInfiniteScrollReturn {
  isLoading: ComputedRef<boolean>
  reset: () => void
}

/**
 * Reactive infinite scroll.
 *
 * @see https://vueuse.org/useInfiniteScroll
 */
export function useInfiniteScroll<T extends InfiniteScrollElement>(
  element: MaybeRefOrGetter<T>,
  onLoadMore: (state: UnwrapNestedRefs<UseScrollReturn>) => Awaitable<void>,
  options: UseInfiniteScrollOptions<T> = {},
): UseInfiniteScrollReturn {
  const {
    direction = 'bottom',
    interval = 100,
    canLoadMore = () => true,
    trigger,
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

  const promise = shallowRef<Promise<unknown> | null>()
  const isLoading = computed(() => !!promise.value)

  // Document and Window cannot be observed by IntersectionObserver
  const observedElement = computed<HTMLElement | SVGElement | null | undefined>(() => {
    return resolveElement(toValue(element))
  })

  const canLoad = computed(() => {
    if (!observedElement.value)
      return false
    return canLoadMore(observedElement.value as T)
  })

  if (trigger) {
    const distance = options.distance ?? 0
    const rootMarginMap = {
      bottom: `0px 0px ${distance}px 0px`,
      top: `${distance}px 0px 0px 0px`,
      left: `0px 0px 0px ${distance}px`,
      right: `0px ${distance}px 0px 0px`,
    }

    const isTriggered = shallowRef(false)

    function triggerLoad() {
      if (!canLoad.value || promise.value)
        return

      promise.value = Promise.all([
        onLoadMore(state),
        new Promise(resolve => setTimeout(resolve, interval)),
      ])
        .finally(() => {
          promise.value = null
          nextTick(() => {
            if (isTriggered.value)
              triggerLoad()
          })
        })
    }

    useIntersectionObserver(
      trigger,
      (entries) => {
        isTriggered.value = entries.some(e => e.isIntersecting)
      },
      {
        root: observedElement,
        rootMargin: rootMarginMap[direction],
      },
    )

    watch(
      () => [isTriggered.value, canLoad.value],
      () => {
        if (isTriggered.value)
          triggerLoad()
      },
      { flush: 'post' },
    )

    return {
      isLoading,
      reset() {
        nextTick(() => triggerLoad())
      },
    }
  }

  const isElementVisible = useElementVisibility(observedElement)

  function checkAndLoad() {
    state.measure()

    if (!observedElement.value || !isElementVisible.value || !canLoad.value || promise.value)
      return

    const { scrollHeight, clientHeight, scrollWidth, clientWidth } = observedElement.value as HTMLElement
    const isNarrower = (direction === 'bottom' || direction === 'top')
      ? scrollHeight <= clientHeight
      : scrollWidth <= clientWidth

    if (state.arrivedState[direction] || isNarrower) {
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

  const stop = watch(
    () => [state.arrivedState[direction], isElementVisible.value, canLoad.value],
    checkAndLoad,
    { immediate: true, flush: 'post' },
  )

  tryOnUnmounted(stop)

  return {
    isLoading,
    reset() {
      nextTick(() => checkAndLoad())
    },
  }
}
