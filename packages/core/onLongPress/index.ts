import type { Fn } from '@vueuse/shared'
import { computed } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { Position } from '../types'

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
   * Distance in pixels
   *
   * @default 10
   */
  threshold?: number
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
  handler: (evt: PointerEvent) => void,
  options?: OnLongPressOptions,
) {
  const elementRef = computed(() => unrefElement(target))

  let timeout: ReturnType<typeof setTimeout> | undefined
  let posStart: Position | undefined

  function clear() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    posStart = undefined
  }

  function onDown(ev: PointerEvent) {
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
    timeout = setTimeout(
      () => handler(ev),
      options?.delay ?? DEFAULT_DELAY,
    )
  }

  function onMove(ev: PointerEvent) {
    if (options?.modifiers?.self && ev.target !== elementRef.value)
      return

    if (!posStart)
      return

    if (options?.modifiers?.prevent)
      ev.preventDefault()

    if (options?.modifiers?.stop)
      ev.stopPropagation()

    const dx = ev.x - posStart.x
    const dy = ev.y - posStart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance >= (options?.threshold ?? DEFAULT_THRESHOLD))
      clear()
  }

  const listenerOptions: AddEventListenerOptions = {
    capture: options?.modifiers?.capture,
    once: options?.modifiers?.once,
  }

  const cleanup = [
    useEventListener(elementRef, 'pointerdown', onDown, listenerOptions),
    useEventListener(elementRef, 'pointermove', onMove, listenerOptions),
    useEventListener(elementRef, ['pointerup', 'pointerleave'], clear, listenerOptions),
  ].filter(Boolean) as Fn[]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
