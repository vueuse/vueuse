import { reactive, ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { noop, useDebounceFn, useThrottleFn } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

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
 * Reactive scroll.
 *
 * @see https://vueuse.org/useScroll
 * @param element
 * @param options
 */

export function useScroll(
  element: MaybeRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
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
  const isWheeling = ref(false)
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })
  const scrollDirections = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false,
  })
  const wheelDirections = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false,
  })

  if (element) {
    const onScrollEnd = useDebounceFn((e: Event) => {
      isScrolling.value = false
      isWheeling.value = false
      wheelDirections.left = false
      wheelDirections.right = false
      wheelDirections.top = false
      wheelDirections.bottom = false
      scrollDirections.left = false
      scrollDirections.right = false
      scrollDirections.top = false
      scrollDirections.bottom = false
      onStop(e)
    }, throttle + idle)

    const onScrollHandler = (e: Event) => {
      const eventTarget = (
        e.target === document ? (e.target as Document).documentElement : e.target
      ) as HTMLElement

      const scrollLeft = eventTarget.scrollLeft
      scrollDirections.left = scrollLeft < x.value
      scrollDirections.right = scrollLeft > x.value
      arrivedState.left = scrollLeft <= 0 + (offset.left || 0)
      arrivedState.right
          = scrollLeft + eventTarget.clientWidth >= eventTarget.scrollWidth - (offset.right || 0)
      x.value = scrollLeft

      const scrollTop = eventTarget.scrollTop
      scrollDirections.top = scrollTop < y.value
      scrollDirections.bottom = scrollTop > y.value
      arrivedState.top = scrollTop <= 0 + (offset.top || 0)
      arrivedState.bottom
          = scrollTop + eventTarget.clientHeight >= eventTarget.scrollHeight - (offset.bottom || 0)
      y.value = scrollTop

      isScrolling.value = true
      onScrollEnd(e)
      onScroll(e)
    }

    const onWheelHandler = (e: WheelEvent) => {
      if (e.shiftKey) {
        wheelDirections.left = e.deltaY < 0
        wheelDirections.right = e.deltaY > 0
      }
      else {
        wheelDirections.top = e.deltaY < 0
        wheelDirections.bottom = e.deltaY > 0
        wheelDirections.left = e.deltaX < 0
        wheelDirections.right = e.deltaX > 0
      }

      isWheeling.value = true
      onScrollEnd(e)
    }

    useEventListener(
      element,
      'scroll',
      throttle ? useThrottleFn(onScrollHandler, throttle) : onScrollHandler,
      eventListenerOptions,
    )

    useEventListener(
      element,
      'wheel',
      throttle ? useThrottleFn(onWheelHandler, throttle) : onWheelHandler,
      eventListenerOptions,
    )
  }

  return {
    x,
    y,
    isScrolling,
    isWheeling,
    arrivedState,
    scrollDirections,
    wheelDirections,
  }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
