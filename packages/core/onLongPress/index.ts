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
  delay?: number

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
   */
  onMouseUp?: (duration: number, distance: number, isLongPress: boolean) => void
}

export interface OnLongPressModifiers {
  stop?: boolean
  once?: boolean
  prevent?: boolean
  capture?: boolean
  self?: boolean
}

export function onLongPress(
  target: MaybeElementRef,
  handler: (evt: PointerEvent | TouchEvent) => void,
  options?: OnLongPressOptions,
) {
  const elementRef = computed(() => unrefElement(target))

  let timeout: ReturnType<typeof setTimeout> | undefined
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

  function onRelease(ev: PointerEvent) {
    if (ev.pointerType === 'touch')
      return

    const [_startTimestamp, _posStart, _hasLongPressed] = [
      startTimestamp,
      posStart,
      hasLongPressed,
    ]
    clear()

    if (!options?.onMouseUp || !_posStart || !_startTimestamp)
      return

    if (options?.modifiers?.self && ev.target !== elementRef.value)
      return

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    const dx = ev.x - _posStart.x
    const dy = ev.y - _posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    options.onMouseUp(ev.timeStamp - _startTimestamp, distance, _hasLongPressed)
  }

  function onDown(ev: PointerEvent) {
    if (ev.pointerType === 'touch')
      return

    if (options?.modifiers?.self && ev.target !== elementRef.value)
      return

    clear()

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    posStart = {
      x: ev.x,
      y: ev.y,
    }
    startTimestamp = ev.timeStamp
    timeout = setTimeout(() => {
      hasLongPressed = true
      handler(ev)
    }, options?.delay ?? DEFAULT_DELAY)
  }

  function onMove(ev: PointerEvent) {
    if (ev.pointerType === 'touch')
      return

    if (options?.modifiers?.self && ev.target !== elementRef.value)
      return

    if (!posStart || options?.distanceThreshold === false)
      return

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    const dx = ev.x - posStart.x
    const dy = ev.y - posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance >= (options?.distanceThreshold ?? DEFAULT_THRESHOLD))
      clear()
  }

  function onTouchRelease(ev: TouchEvent) {
    const [_startTimestamp, _posStart, _hasLongPressed] = [
      startTimestamp,
      posStart,
      hasLongPressed,
    ]
    clear()

    if (!options?.onMouseUp || !_posStart || !_startTimestamp)
      return

    if (options?.modifiers?.self && ev.target !== elementRef.value)
      return

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    const dx = ev.touches[0]?.clientX ?? 0 - _posStart.x
    const dy = ev.touches[0]?.clientY ?? 0 - _posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    options.onMouseUp(ev.timeStamp - _startTimestamp, distance, _hasLongPressed)
  }

  function onTouchStart(ev: TouchEvent) {
    if (options?.modifiers?.self && ev.target !== elementRef.value)
      return

    clear()

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    posStart = {
      x: ev.touches[0]?.clientX ?? 0,
      y: ev.touches[0]?.clientY ?? 0,
    }
    startTimestamp = ev.timeStamp
    timeout = setTimeout(() => {
      hasLongPressed = true
      handler(ev)
    }, options?.delay ?? DEFAULT_DELAY)
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

  function onTouchMove(ev: TouchEvent) {
    if (options?.modifiers?.self && ev.target !== elementRef.value)
      return

    const x = ev.touches[0]?.clientX ?? 0
    const y = ev.touches[0]?.clientY ?? 0
    if (isTouchOut(x, y))
      return

    if (!posStart || options?.distanceThreshold === false)
      return

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    const dx = x - posStart.x
    const dy = y - posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance >= (options?.distanceThreshold ?? DEFAULT_THRESHOLD))
      clear()
  }

  const listenerOptions: AddEventListenerOptions = {
    capture: options?.modifiers?.capture,
    once: options?.modifiers?.once,
  }

  const cleanup = [
    useEventListener(elementRef, 'pointerdown', onDown, listenerOptions),
    useEventListener(elementRef, 'pointermove', onMove, listenerOptions),
    useEventListener(elementRef, ['pointerup', 'pointerleave'], onRelease, listenerOptions),
    useEventListener(elementRef, 'touchstart', onTouchStart, listenerOptions),
    useEventListener(elementRef, 'touchmove', onTouchMove, listenerOptions),
    useEventListener(elementRef, ['touchend', 'touchout'], onTouchRelease, listenerOptions),
  ]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
