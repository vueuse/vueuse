import { noop, MaybeRef } from '@vueuse/shared'
import { computed, reactive, ref, ComputedRef } from 'vue-demi'

import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export enum SwipeDirection {
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT'
}

export interface SwipeOptions extends ConfigurableWindow {
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
  onSwipeEnd?: (e: TouchEvent, direction: SwipeDirection) => void
}

export interface SwipeReturn {
  isPassiveEventSupported: boolean
  isSwiping: ComputedRef<boolean>
  direction: ComputedRef<SwipeDirection | null>
  coordsStart: {
    readonly x: number
    readonly y: number
  }
  coordsEnd: {
    readonly x: number
    readonly y: number
  }
  lengthX: ComputedRef<number>
  lengthY: ComputedRef<number>
  stop: () => void
}

/**
 * Reactive swipe detection.
 *
 * @see {@link https://vueuse.js.org/useSwipe}
 * @param target
 * @param options
 */
export function useSwipe(
  target: MaybeRef<EventTarget | null | undefined>,
  options: SwipeOptions = {},
) {
  const {
    threshold = 50,
    onSwipe,
    onSwipeEnd,
    onSwipeStart,
    passive = true,
    window = defaultWindow,
  } = options

  const coordsStart = reactive({ x: 0, y: 0 })
  const coordsEnd = reactive({ x: 0, y: 0 })

  const diffX = computed(() => coordsStart.x - coordsEnd.x)
  const diffY = computed(() => coordsStart.y - coordsEnd.y)

  const { max, abs } = Math
  const isThresholdExceeded = computed(() => max(abs(diffX.value), abs(diffY.value)) >= threshold)

  const isSwiping = ref(false)

  const direction = computed(() => {
    if (!isThresholdExceeded.value)
      return null

    if (abs(diffX.value) > abs(diffY.value)) {
      return diffX.value > 0
        ? SwipeDirection.LEFT
        : SwipeDirection.RIGHT
    }
    else {
      return diffY.value > 0
        ? SwipeDirection.UP
        : SwipeDirection.DOWN
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

  let listenerOptions: { passive?: boolean; capture?: boolean }

  const isPassiveEventSupported = checkPassiveEventSupport(window?.document)

  if (!passive)
    listenerOptions = isPassiveEventSupported ? { passive: false, capture: true } : { capture: true }
  else
    listenerOptions = isPassiveEventSupported ? { passive: true } : { capture: false }

  const stops = [
    useEventListener(target, 'touchstart', (e: TouchEvent) => {
      if (listenerOptions.capture && !listenerOptions.passive)
        e.preventDefault()
      const [x, y] = getTouchEventCoords(e)
      updateCoordsStart(x, y)
      updateCoordsEnd(x, y)
      onSwipeStart?.(e)
    }, listenerOptions),

    useEventListener(target, 'touchmove', (e: TouchEvent) => {
      const [x, y] = getTouchEventCoords(e)
      updateCoordsEnd(x, y)
      if (direction.value) {
        isSwiping.value = true
        onSwipe?.(e)
      }
    }, listenerOptions),

    useEventListener(target, 'touchend', (e: TouchEvent) => {
      isSwiping.value = false
      if (direction.value)
        onSwipeEnd?.(e, direction.value)
    }, listenerOptions),
  ]

  const stop = () => stops.forEach(s => s())

  return {
    isPassiveEventSupported,
    isSwiping,
    direction,
    coordsStart,
    coordsEnd,
    lengthX: diffX,
    lengthY: diffY,
    stop,
  }
}

/**
 * This is a polyfill for passive event support detection
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md}
 */
function checkPassiveEventSupport(document?: Document) {
  if (!document)
    return false
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
