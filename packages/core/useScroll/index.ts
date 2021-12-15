import { ref, reactive, unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { useThrottleFn, useDebounceFn, noop, isWindowsOS } from '@vueuse/shared'
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

  /**
   * wheel direction control.
   *
   * @default 'auto'
   */
  wheelDirection?: MaybeRef<'horizontal' | 'vertical' | 'auto' | undefined>
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
    wheelDirection = 'auto',
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

  if (element) {
    const onScrollEnd = useDebounceFn((e: Event) => {
      isScrolling.value = false
      directions.left = false
      directions.right = false
      directions.top = false
      directions.bottom = false
      onStop(e)
    }, throttle + idle)

    const onScrollHandler = (e: Event) => {
      const eventTarget = (
        e.target === document ? (e.target as Document).documentElement : e.target
      ) as HTMLElement

      const scrollLeft = eventTarget.scrollLeft
      directions.left = scrollLeft < x.value
      directions.right = scrollLeft > x.value
      arrivedState.left = scrollLeft <= 0 + (offset.left || 0)
      arrivedState.right
        = scrollLeft + eventTarget.clientWidth >= eventTarget.scrollWidth - (offset.right || 0)
      x.value = scrollLeft

      const scrollTop = eventTarget.scrollTop
      directions.top = scrollTop < y.value
      directions.bottom = scrollTop > y.value
      arrivedState.top = scrollTop <= 0 + (offset.top || 0)
      arrivedState.bottom
        = scrollTop + eventTarget.clientHeight >= eventTarget.scrollHeight - (offset.bottom || 0)
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

    useEventListener(element, 'wheel', (e: WheelEvent) => {
      const direction = unref(wheelDirection) ?? 'auto'

      if (direction !== 'auto') {
        e.preventDefault()

        const ele = unref(element) as HTMLElement

        if (direction === 'horizontal') {
          // @ts-expect-error e.wheelDeltaX,e.wheelDeltaY no type
          let wheelDelta: number = Math.abs(e.wheelDeltaX) >= Math.abs(e.wheelDeltaY) ? e.wheelDeltaX : e.wheelDeltaY
          wheelDelta = -(isWindowsOS ? wheelDelta / 3 : wheelDelta)

          ele.scrollTo({
            left: ele.scrollLeft + wheelDelta,
          })
        }
        else if (direction === 'vertical') {
          // @ts-expect-error e.wheelDeltaX,e.wheelDeltaY no type
          let wheelDelta: number = Math.abs(e.wheelDeltaY) >= Math.abs(e.wheelDeltaX) ? e.wheelDeltaY : e.wheelDeltaX
          wheelDelta = -(isWindowsOS ? wheelDelta / 3 : wheelDelta)

          ele.scrollTo({
            top: ele.scrollTop + wheelDelta,
          })
        }
      }
    })
  }

  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
  }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
