import type { TimerHandle } from '@vueuse/shared'
import type { Position } from '../types'
import type { MaybeElementRef } from '../unrefElement'
import { computed } from 'vue'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

const DEFAULT_DELAY = 500
const DEFAULT_THRESHOLD = 10

export interface OnLongPressOptions {
  /**
   * Time in ms till `longpress` gets called
   *
   * @default 500
   */
  delay?: number | ((ev: PointerEvent | TouchEvent) => number)

  modifiers?: OnLongPressModifiers

  /**
   * Allowance of moving distance in pixels,
   * The action will get canceled When moving too far from the pointerdown position.
   * @default 10
   */
  distanceThreshold?: number | false

  /**
   * Function called when the ref element is released.
   * @param duration how long the element was pressed in ms
   * @param distance distance from the pointerdown position
   * @param isLongPress whether the action was a long press or not
   * @param pointerEvent the native {@link PointerEvent} triggered by the browser
   */
  onMouseUp?: (duration: number, distance: number, isLongPress: boolean, pointerEvent: PointerEvent | TouchEvent) => void
}

export interface OnLongPressModifiers {
  stop?: boolean
  once?: boolean
  prevent?: boolean
  capture?: boolean
  self?: boolean
}

export type OnLongPressReturn = () => void
/** @deprecated use {@link OnLongPressReturn} instead */
export type UseOnLongPressReturn = OnLongPressReturn

export function onLongPress(
  target: MaybeElementRef,
  handler: (evt: PointerEvent | TouchEvent) => void,
  options?: OnLongPressOptions,
): OnLongPressReturn {
  const elementRef = computed(() => unrefElement(target))

  let timeout: TimerHandle
  let posStart: Position | undefined
  let startTimestamp: number | undefined
  let hasLongPressed = false

  function clear() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    posStart = undefined
    startTimestamp = undefined
    hasLongPressed = false
  }

  function getDelay(ev: PointerEvent | TouchEvent): number {
    const delay = options?.delay
    if (typeof delay === 'function') {
      return delay(ev)
    }
    return delay ?? DEFAULT_DELAY
  }

  function getEventCoordinates(ev: PointerEvent | TouchEvent): { x: number, y: number } {
    if ('x' in ev) {
      return { x: ev.x, y: ev.y }
    }
    return {
      x: ev.touches[0]?.clientX ?? 0,
      y: ev.touches[0]?.clientY ?? 0,
    }
  }

  function processModifiers(ev: PointerEvent | TouchEvent): boolean {
    if (options?.modifiers?.self && ev.target !== elementRef.value)
      return false

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    return true
  }

  function handleStart(ev: PointerEvent | TouchEvent) {
    if ('pointerType' in ev && ev.pointerType === 'touch')
      return

    if (!processModifiers(ev))
      return

    clear()

    const coords = getEventCoordinates(ev)
    posStart = coords
    startTimestamp = ev.timeStamp
    timeout = setTimeout(
      () => {
        hasLongPressed = true
        handler(ev)
      },
      getDelay(ev),
    )
  }

  function handleMove(ev: PointerEvent | TouchEvent) {
    if ('pointerType' in ev && ev.pointerType === 'touch')
      return

    if (!processModifiers(ev))
      return

    if ('touches' in ev) {
      const coords = getEventCoordinates(ev)
      if (isTouchOut(coords.x, coords.y))
        return
    }

    if (!posStart || options?.distanceThreshold === false)
      return

    const coords = getEventCoordinates(ev)
    const dx = coords.x - posStart.x
    const dy = coords.y - posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance >= (options?.distanceThreshold ?? DEFAULT_THRESHOLD))
      clear()
  }

  function handleRelease(ev: PointerEvent | TouchEvent) {
    if ('pointerType' in ev && ev.pointerType === 'touch')
      return

    const [_startTimestamp, _posStart, _hasLongPressed] = [
      startTimestamp,
      posStart,
      hasLongPressed,
    ]
    clear()

    if (!options?.onMouseUp || !_posStart || !_startTimestamp)
      return

    if (!processModifiers(ev))
      return

    const coords = getEventCoordinates(ev)
    const dx = coords.x - _posStart.x
    const dy = coords.y - _posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    options.onMouseUp(ev.timeStamp - _startTimestamp, distance, _hasLongPressed, ev)
  }

  function isTouchOut(x: number, y: number): boolean {
    const { left, right, top, bottom } = elementRef.value?.getBoundingClientRect() ?? {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }
    const isOutOfBound = x < left || x > right || y < top || y > bottom
    if (isOutOfBound) {
      elementRef.value?.dispatchEvent(new CustomEvent('touchout'))
    }
    return isOutOfBound
  }

  const listenerOptions: AddEventListenerOptions = {
    capture: options?.modifiers?.capture,
    once: options?.modifiers?.once,
  }

  const cleanup = [
    useEventListener(elementRef, 'pointerdown', handleStart, listenerOptions),
    useEventListener(elementRef, 'pointermove', handleMove, listenerOptions),
    useEventListener(elementRef, ['pointerup', 'pointerleave'], handleRelease, listenerOptions),
    useEventListener(elementRef, 'touchstart', handleStart, listenerOptions),
    useEventListener(elementRef, 'touchmove', handleMove, listenerOptions),
    useEventListener(elementRef, ['touchend', 'touchout'], handleRelease, listenerOptions),
  ]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
