import { ref, reactive } from 'vue-demi'
import { useThrottleFn, useDebounceFn, noop } from '@vueuse/shared'
import { MaybeElementRef } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { defaultWindow } from '../_configurable'

export interface UseScrollOptions {
  /**
   * Throttle time for scroll event,it’s disabled by default.
   *
   * @default 0
   */
  throttle?: number

  /**
   * The check time when scrolling ends.
   * This configuration will be setting to (throttle + checkStopTime) when the `throttle` is configured.
   *
   * @default 200
   */
  checkStopTime?: number

  /**
   * Trigger it when scrolling ends.
   *
   */
  onStop?: () => void

  /**
   * Enabled direction for scroll.
   *
   * @default ['x','y']
   */
  enabledDirection?: Array<'x'|'y'>

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
 * @param {MaybeElementRef} element
 * @param {() => void} [handler=noop]
 * @param {UseScrollOptions} [options={}]
 */
export function useScroll(
  element: MaybeElementRef,
  handler: () => void = noop,
  options: UseScrollOptions = {},
) {
  const {
    throttle = 0,
    checkStopTime = 200,
    onStop = noop,
    enabledDirection = ['x', 'y'],
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
  }
  = options

  const x = ref(0)
  const y = ref(0)
  const scrolling = ref(false)
  const finished = ref(false)
  const arrivedStatus = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })

  if (!element || element === defaultWindow) return { x, y, scrolling, finished, arrivedStatus }

  const onScrollEnd = useDebounceFn(() => {
    scrolling.value = false
    finished.value = true
    onStop()
  }, throttle + checkStopTime)

  const onScroll = (e: Event) => {
    const eventTarget = e.target as HTMLElement

    if (enabledDirection.includes('x')) {
      const scrollLeft = eventTarget.scrollLeft
      arrivedStatus.left = scrollLeft === 0
      arrivedStatus.right = scrollLeft + eventTarget.clientWidth === eventTarget.scrollWidth
      x.value = scrollLeft
    }

    if (enabledDirection.includes('y')) {
      const scrollTop = eventTarget.scrollTop
      arrivedStatus.top = scrollTop === 0
      arrivedStatus.bottom = scrollTop + eventTarget.clientHeight === eventTarget.scrollHeight
      y.value = scrollTop
    }

    scrolling.value = true
    finished.value = false
    onScrollEnd()
    handler()
  }

  useEventListener(
    element,
    'scroll',
    throttle ? useThrottleFn(onScroll, throttle) : onScroll
    ,
    eventListenerOptions,
  )

  return { x, y, scrolling, finished, arrivedStatus }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
