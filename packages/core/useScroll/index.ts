import { reactive, ref, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { noop, useDebounceFn, useThrottleFn } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { useElementSize } from '../useElementSize'

export interface UseScrollOptions {
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
 * We have to check if the scroll amount is close enough to some threshold in order to
 * more accurately calculate arrivedState. This is because scrollTop/scrollLeft are non-rounded
 * numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
 */
const ARRIVED_STATE_THRESHOLD_PIXELS = 1

/**
 * Reactive scroll.
 *
 * @see https://vueuse.org/useScroll
 * @param element
 * @param options
 */

export function useScroll(
  element: MaybeComputedRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  options: UseScrollOptions = {},
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
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })
  const directions = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false,
  })

  const size = useElementSize(element)

  const onScrollEnd = useDebounceFn((e: Event) => {
    isScrolling.value = false
    directions.left = false
    directions.right = false
    directions.top = false
    directions.bottom = false
    onStop(e)
  }, throttle + idle)

  const getEventTarget = (e: Event) => {
    const target = e.target === document ? (e.target as Document).documentElement : e.target as HTMLElement
    target.scrollTop = e.target !== document || target.scrollTop
      ? target.scrollTop
      : document.body.scrollTop // patch for mobile compatible
    return target
  }

  const setArrivedState = ({ scrollLeft, scrollTop, clientWidth, scrollWidth, clientHeight, scrollHeight }: HTMLElement) => {
    arrivedState.left = scrollLeft <= 0 + (offset.left || 0)
    arrivedState.right
      = scrollLeft + clientWidth >= scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    arrivedState.top = scrollTop <= 0 + (offset.top || 0)
    arrivedState.bottom
      = scrollTop + clientHeight >= scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS
  }

  const onScrollHandler = (e: Event) => {
    const eventTarget = getEventTarget(e)
    const { scrollLeft, scrollTop } = eventTarget

    directions.left = scrollLeft < x.value
    directions.right = scrollLeft > x.value
    x.value = scrollLeft

    directions.top = scrollTop < y.value
    directions.bottom = scrollTop > y.value
    y.value = scrollTop

    setArrivedState(eventTarget)

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

  watch([size.width, size.height], (e: Event) => {
    const eventTarget = getEventTarget(e)
    const fn = () => setArrivedState(eventTarget)
    throttle ? useThrottleFn(fn, throttle) : fn()
  })

  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
  }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
