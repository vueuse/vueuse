import type { MaybeComputedRef } from '@vueuse/shared'
import { noop } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import { computed, reactive, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import type { Position } from '../types'

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
  isPassiveEventSupported: boolean
  isSwiping: Ref<boolean>
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
  target: MaybeComputedRef<EventTarget | null | undefined>,
  options: UseSwipeOptions = {},
): UseSwipeReturn {
  const {
    threshold = 50,
    onSwipe,
    onSwipeEnd,
    onSwipeStart,
    passive = true,
    window = defaultWindow,
  } = options

  const coordsStart = reactive<Position>({ x: 0, y: 0 })
  const coordsEnd = reactive<Position>({ x: 0, y: 0 })

  const diffX = computed(() => coordsStart.x - coordsEnd.x)
  const diffY = computed(() => coordsStart.y - coordsEnd.y)

  const { max, abs } = Math
  const isThresholdExceeded = computed(() => max(abs(diffX.value), abs(diffY.value)) >= threshold)

  const isSwiping = ref(false)

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

  let listenerOptions: { passive?: boolean; capture?: boolean }

  const isPassiveEventSupported = checkPassiveEventSupport(window?.document)

  if (!passive)
    listenerOptions = isPassiveEventSupported ? { passive: false, capture: true } : { capture: true }
  else
    listenerOptions = isPassiveEventSupported ? { passive: true } : { capture: false }

  const onTouchEnd = (e: TouchEvent) => {
    if (isSwiping.value)
      onSwipeEnd?.(e, direction.value)

    isSwiping.value = false
  }

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
      if (!isSwiping.value && isThresholdExceeded.value)
        isSwiping.value = true
      if (isSwiping.value)
        onSwipe?.(e)
    }, listenerOptions),

    useEventListener(target, 'touchend', onTouchEnd, listenerOptions),
    useEventListener(target, 'touchcancel', onTouchEnd, listenerOptions),
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
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
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
