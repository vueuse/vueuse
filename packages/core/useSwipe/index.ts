import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { Position } from '../types'
import { computed, reactive, shallowRef } from 'vue'
import { useEventListener } from '../useEventListener'

export type UseSwipeDirection = 'up' | 'down' | 'left' | 'right' | 'none'

export interface UseSwipeOptions extends ConfigurableWindow {
  /**
   * Register events as passive
   *
   * @default true
   */
  passive?: boolean

  /**
   * @default 50
   */
  threshold?: number

  /**
   * Callback on swipe start
   */
  onSwipeStart?: (e: TouchEvent) => void

  /**
   * Callback on swipe moves
   */
  onSwipe?: (e: TouchEvent) => void

  /**
   * Callback on swipe ends
   */
  onSwipeEnd?: (e: TouchEvent, direction: UseSwipeDirection) => void
}

export interface UseSwipeReturn {
  /**
   * @deprecated No longer need this Vue 3's browser targets all supporting passive event listeners.
   *
   * This flag will always return `true` and be removed in the next major version.
   */
  isPassiveEventSupported: boolean
  isSwiping: ShallowRef<boolean>
  direction: ComputedRef<UseSwipeDirection>
  coordsStart: Readonly<Position>
  coordsEnd: Readonly<Position>
  lengthX: ComputedRef<number>
  lengthY: ComputedRef<number>
  stop: () => void
}

/**
 * Reactive swipe detection.
 *
 * @see https://vueuse.org/useSwipe
 * @param target
 * @param options
 */
export function useSwipe(
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  options: UseSwipeOptions = {},
): UseSwipeReturn {
  const {
    threshold = 50,
    onSwipe,
    onSwipeEnd,
    onSwipeStart,
    passive = true,
  } = options

  const coordsStart = reactive<Position>({ x: 0, y: 0 })
  const coordsEnd = reactive<Position>({ x: 0, y: 0 })

  const diffX = computed(() => coordsStart.x - coordsEnd.x)
  const diffY = computed(() => coordsStart.y - coordsEnd.y)

  const { max, abs } = Math
  const isThresholdExceeded = computed(() => max(abs(diffX.value), abs(diffY.value)) >= threshold)

  const isSwiping = shallowRef(false)

  const direction = computed((): UseSwipeDirection => {
    if (!isThresholdExceeded.value)
      return 'none'

    if (abs(diffX.value) > abs(diffY.value)) {
      return diffX.value > 0
        ? 'left'
        : 'right'
    }
    else {
      return diffY.value > 0
        ? 'up'
        : 'down'
    }
  })

  const getTouchEventCoords = (e: TouchEvent) => [e.touches[0].clientX, e.touches[0].clientY]

  const updateCoordsStart = (x: number, y: number) => {
    coordsStart.x = x
    coordsStart.y = y
  }

  const updateCoordsEnd = (x: number, y: number) => {
    coordsEnd.x = x
    coordsEnd.y = y
  }

  const listenerOptions = { passive, capture: !passive }

  const onTouchEnd = (e: TouchEvent) => {
    if (isSwiping.value)
      onSwipeEnd?.(e, direction.value)

    isSwiping.value = false
  }

  const stops = [
    useEventListener(target, 'touchstart', (e: TouchEvent) => {
      if (e.touches.length !== 1)
        return
      const [x, y] = getTouchEventCoords(e)
      updateCoordsStart(x, y)
      updateCoordsEnd(x, y)
      onSwipeStart?.(e)
    }, listenerOptions),

    useEventListener(target, 'touchmove', (e: TouchEvent) => {
      if (e.touches.length !== 1)
        return
      const [x, y] = getTouchEventCoords(e)
      updateCoordsEnd(x, y)
      if (listenerOptions.capture && !listenerOptions.passive && Math.abs(diffX.value) > Math.abs(diffY.value))
        e.preventDefault()
      if (!isSwiping.value && isThresholdExceeded.value)
        isSwiping.value = true
      if (isSwiping.value)
        onSwipe?.(e)
    }, listenerOptions),

    useEventListener(target, ['touchend', 'touchcancel'], onTouchEnd, listenerOptions),
  ]

  const stop = () => stops.forEach(s => s())

  return {
    isSwiping,
    direction,
    coordsStart,
    coordsEnd,
    lengthX: diffX,
    lengthY: diffY,
    stop,

    // TODO: Remove in the next major version
    isPassiveEventSupported: true,
  }
}
