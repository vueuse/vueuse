import { ref } from 'vue-demi'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export type OnClickOutsideEvents = Pick<WindowEventMap, 'click' | 'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'pointerdown' | 'pointerup'>
export interface OnClickOutsideOptions<E extends keyof OnClickOutsideEvents = 'pointerup'> extends ConfigurableWindow {
  event?: E
}

/**
 * Listen for clicks outside of an element.
 *
 * @see https://vueuse.org/onClickOutside
 * @param target
 * @param handler
 * @param options
 */
export function onClickOutside<E extends keyof OnClickOutsideEvents = 'pointerup'>(
  target: MaybeElementRef,
  handler: (evt: OnClickOutsideEvents[E]) => void,
  options: OnClickOutsideOptions<E> = {},
) {
  const { window = defaultWindow, event = 'pointerup' } = options

  if (!window)
    return

  const shouldListen = ref(true)

  const listener = (event: OnClickOutsideEvents[E]) => {
    if (!shouldListen.value)
      return

    const el = unrefElement(target)

    if (!el || el === event.target || event.composedPath().includes(el))
      return

    handler(event)
  }

  const cleanup = [
    useEventListener(window, event, listener, { passive: true }),
  ]

  if (/(click|up|end)/.test(event)) {
    cleanup.push(
      useEventListener(window, 'pointerdown', () => (shouldListen.value = true), { passive: true }),
      useEventListener(window, 'scroll', () => (shouldListen.value = false), { passive: true }),
    )
  }

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
