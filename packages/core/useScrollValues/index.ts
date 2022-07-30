import { reactive, ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { noop, useDebounceFn, useThrottleFn } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export interface UseScrollValueOptions {
  /**
   * Throttle time for scroll event, it’s disabled by default.
   *
   * @default 0
   */
  throttle?: number

  /**
   * The check time when scrolling ends.
   * This configuration will be setting to (throttle + idle) when the `throttle` is configured.
   *
   * @default 200
   */
  idle?: number

  /**
   * Offset arrived states by x pixels
   *
   */
  offset?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }

  /**
   * Trigger it when scrolling.
   *
   */
  onScroll?: (e: Event) => void

  /**
   * Trigger it when scrolling ends.
   *
   */
  onStop?: (e: Event) => void

  /**
   * Listener options for scroll event.
   *
   * @default {capture: false, passive: true}
   */
  eventListenerOptions?: boolean | AddEventListenerOptions
}

/**
 * Reactive scroll.
 *
 * @see https://vueuse.org/useScrollValues
 * @param element
 * @param options
 */

export function useScrollValues(
  element: MaybeComputedRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  options: UseScrollValueOptions = {},
) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
    onScroll = noop,
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
  } = options

  const x = ref(0)
  const y = ref(0)
  const isScrolling = ref(false)
  const distances = reactive({
    left: Infinity,
    right: Infinity,
    top: Infinity,
    bottom: Infinity,
  })
  const rates = reactive({
    horizontal: 0,
    vertical: 0,
  })

  const onScrollEnd = useDebounceFn((e: Event) => {
    isScrolling.value = false
    rates.horizontal = 0
    rates.vertical = 0
    onStop(e)
  }, throttle + idle)

  const onScrollHandler = (e: Event) => {
    const eventTarget = (
      e.target === document ? (e.target as Document).documentElement : e.target
    ) as HTMLElement

    const scrollLeft = eventTarget.scrollLeft
    rates.horizontal = scrollLeft - x.value
    distances.left = scrollLeft - (0 + (offset.left || 0))
    distances.right = (eventTarget.scrollWidth - (offset.right || 0)) - (scrollLeft + eventTarget.clientWidth)
    x.value = scrollLeft

    let scrollTop = eventTarget.scrollTop

    // patch for mobile compatible
    if (e.target === document && !scrollTop)
      scrollTop = document.body.scrollTop

    rates.vertical = scrollTop - y.value
    distances.top = scrollTop - (0 + (offset.top || 0))
    distances.bottom = (eventTarget.scrollHeight - (offset.bottom || 0)) - (scrollTop + eventTarget.clientHeight)
    y.value = scrollTop

    isScrolling.value = true
    onScrollEnd(e)
    onScroll(e)
  }

  useEventListener(
    element,
    'scroll',
    throttle ? useThrottleFn(onScrollHandler, throttle) : onScrollHandler,
    eventListenerOptions,
  )

  return {
    x,
    y,
    isScrolling,
    distances,
    rates,
  }
}

export type UseScrollValuesReturn = ReturnType<typeof useScrollValues>
