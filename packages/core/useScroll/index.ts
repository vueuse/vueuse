import { ref, reactive } from 'vue-demi'
import { useThrottleFn, useDebounceFn, noop } from '@vueuse/shared'
import { MaybeElementRef } from '../unrefElement'
import { useEventListener } from '../useEventListener'

export interface UseScrollOptions {
  /**
   * Throttle time for scroll event,it’s disabled by default.
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
   * Trigger it when scrolling.
   *
   */
  onScroll?: () => void

  /**
   * Trigger it when scrolling ends.
   *
   */
  onStop?: () => void

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
 * @param {UseScrollOptions} [options={}]
 */

export function useScroll(
  element: MaybeElementRef,
  options: UseScrollOptions = {},
) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
    onScroll = noop,
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

  if (!element) return { x, y, scrolling, finished, arrivedStatus }

  const onScrollEnd = useDebounceFn(() => {
    scrolling.value = false
    finished.value = true
    onStop()
  }, throttle + idle)

  const onScrollHandler = (e: Event) => {
    const eventTarget = (e.target === document ? (e.target as Document).documentElement : e.target) as HTMLElement

    const scrollLeft = eventTarget.scrollLeft
    arrivedStatus.left = scrollLeft === 0
    arrivedStatus.right = scrollLeft + eventTarget.clientWidth === eventTarget.scrollWidth
    x.value = scrollLeft

    const scrollTop = eventTarget.scrollTop
    arrivedStatus.top = scrollTop === 0
    arrivedStatus.bottom = scrollTop + eventTarget.clientHeight === eventTarget.scrollHeight
    y.value = scrollTop

    scrolling.value = true
    finished.value = false
    onScrollEnd()
    onScroll()
  }

  useEventListener(
    element,
    'scroll',
    throttle ? useThrottleFn(onScrollHandler, throttle) : onScrollHandler
    ,
    eventListenerOptions,
  )

  return { x, y, scrolling, finished, arrivedStatus }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
