import type { UnwrapNestedRefs } from 'vue-demi'
import { reactive, watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import type { UseScrollOptions } from '../useScroll'
import { useScroll } from '../useScroll'

export interface UseInfiniteScrollOptions extends UseScrollOptions {
  /**
   * The minimum distance between the bottom of the element and the bottom of the viewport
   *
   * @default 0
   */
  distance?: number
}

/**
 * Reactive infinite scroll.
 *
 * @see https://vueuse.org/useInfiniteScroll
 */
export function useInfiniteScroll(
  element: MaybeRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  onLoadMore: (state: UnwrapNestedRefs<ReturnType<typeof useScroll>>) => void,
  options: UseInfiniteScrollOptions = {},
) {
  const state = reactive(useScroll(
    element,
    {
      ...options,
      offset: {
        bottom: options.distance ?? 0,
        ...options.offset,
      },
    },
  ))

  watch(
    () => state.arrivedState.bottom,
    (v) => {
      if (v)
        onLoadMore(state)
    },
  )
}
