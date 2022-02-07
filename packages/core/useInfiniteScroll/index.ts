import { watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import type { UseScrollOptions } from '../useScroll'
import { useScroll } from '../useScroll'

export interface UseInfiniteScrollOptions extends UseScrollOptions {
  /**
   *  the minimum distance between the bottom of the element and the bottom of the viewport
   *
   * @default true
   */
  infiniteScrollDistance?: number

  loadMore?: () => void

}

/**
 * Reactive infinite scroll.
 *
 * @see https://vueuse.org/useInfiniteScroll
 * @param element
 * @param options
 */
export function useInfiniteScroll(
  element: MaybeRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  options: UseInfiniteScrollOptions = {},
) {
  const { arrivedState } = useScroll(element, {
    ...options,
    offset: {
      bottom: options.infiniteScrollDistance,
    },
  })

  watch(arrivedState, () => {
    if (arrivedState.bottom && options.loadMore)
      options.loadMore()
  })
}
