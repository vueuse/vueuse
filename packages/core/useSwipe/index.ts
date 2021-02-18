import { noop, MaybeRef } from '@vueuse/shared'
import { computed, reactive, ref } from 'vue-demi'

import { useEventListener } from '../useEventListener'

export enum SwipeDirection {
  UP = 'UP', RIGHT = 'RIGHT', DOWN = 'DOWN', LEFT = 'LEFT'
}

/**
 * Reactive swipe detection.
 *
 * @see {@link https://vueuse.js.org/useSwipe}
 * @param target
 * @param options
 */
export function useSwipe(
  target: MaybeRef<EventTarget>,
  options: {
    passive?: boolean
    threshold?: number
    onSwipe?: (e: TouchEvent) => void
    onSwipeEnd?: (e: TouchEvent, direction: SwipeDirection) => void
  } = {},
) {
  const { threshold, onSwipe, onSwipeEnd, passive = true } = options || {}
  const isPassiveEventSupported = checkPassiveEventSupport()

  const coordsStart = reactive({ x: 0, y: 0 })
  const coordsEnd = reactive({ x: 0, y: 0 })

  const diffX = computed(() => coordsStart.x - coordsEnd.x)
  const diffY = computed(() => coordsStart.y - coordsEnd.y)

  const isThresholdExeeded = computed(() => Math.max(Math.abs(diffX.value), Math.abs(diffY.value)) >= (threshold || 0))

  const isSwiping = ref(false)

  const direction = computed(() => {
    if (isThresholdExeeded.value) {
      if (Math.abs(diffX.value) > Math.abs(diffY.value)) {
        if (diffX.value > 0) return SwipeDirection.LEFT
        return SwipeDirection.RIGHT
      }
      else {
        if (diffY.value > 0) return SwipeDirection.UP
        else return SwipeDirection.DOWN
      }
    }
    else {
      return null
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

  let listenerOptions: { passive?: boolean; capture?: boolean}
  if (!passive) listenerOptions = isPassiveEventSupported ? { passive: false, capture: true } : { capture: true }
  else listenerOptions = isPassiveEventSupported ? { passive: true } : { capture: false }

  useEventListener(target, 'touchstart', (e: Event) => {
    if (listenerOptions.capture && !listenerOptions.passive) e.preventDefault()
    const [x, y] = getTouchEventCoords(e as TouchEvent)
    updateCoordsStart(x, y)
    updateCoordsEnd(x, y)
  }, listenerOptions)

  useEventListener(target, 'touchmove', (e: Event) => {
    const [x, y] = getTouchEventCoords(e as TouchEvent)
    updateCoordsEnd(x, y)
    if (direction.value) {
      isSwiping.value = true
      onSwipe?.(e as TouchEvent)
    }
  }, listenerOptions)

  useEventListener(target, 'touchend', (e: Event) => {
    isSwiping.value = false
    if (direction.value)
      onSwipeEnd?.(e as TouchEvent, direction.value)
  }, listenerOptions)

  return {
    isSwiping,
    direction,
    coordsStart,
    coordsEnd,
    lengthX: diffX,
    lengthY: diffY,
  }
}

/**
 * This is a polyfill for passive event support detection
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md}
 */
function checkPassiveEventSupport() {
  let supportsPassive = false
  const optionsBlock: AddEventListenerOptions = {
    get passive() {
      supportsPassive = true
      return false
    },
  }
  document.addEventListener('x', noop, optionsBlock)
  document.removeEventListener('x', noop)
  return supportsPassive
}
