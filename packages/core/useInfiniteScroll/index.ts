import type { UnwrapNestedRefs } from 'vue-demi'
import { nextTick, reactive, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
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
   * Whether to preserve the current scroll position when loading more items.
   *
   * @default false
   */
  preserveScrollPosition?: boolean
}

/**
 * Reactive infinite scroll.
 *
 * @see https://vueuse.org/useInfiniteScroll
 */
export function useInfiniteScroll(
  element: MaybeComputedRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  onLoadMore: (state: UnwrapNestedRefs<ReturnType<typeof useScroll>>) => void | Promise<void>,
  options: UseInfiniteScrollOptions = {},
) {
  const direction = options.direction ?? 'bottom'
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

  watch(
    () => state.arrivedState[direction],
    async (v) => {
      if (v) {
        const elem = resolveUnref(element) as Element
        const previous = {
          height: elem?.scrollHeight ?? 0,
          width: elem?.scrollWidth ?? 0,
        }

        await onLoadMore(state)

        if (options.preserveScrollPosition && elem) {
          nextTick(() => {
            elem.scrollTo({
              top: elem.scrollHeight - previous.height,
              left: elem.scrollWidth - previous.width,
            })
          })
        }
      }
    },
  )
}
