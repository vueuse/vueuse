import { tryOnUnmounted } from '@vueuse/shared'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export type AllowedEvents = Pick<WindowEventMap, 'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'pointerdown' | 'pointerup'>
export interface OnClickOutsideOptions<E extends keyof AllowedEvents> extends ConfigurableWindow {
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
export function onClickOutside<E extends keyof AllowedEvents = 'pointerdown'>(
  target: MaybeElementRef,
  handler: (evt: AllowedEvents[E]) => void,
  options: OnClickOutsideOptions<E> = {},
) {
  const { window = defaultWindow, event = 'pointerdown' } = options

  if (!window)
    return

  const listener = (event: AllowedEvents[E]) => {
    const el = unrefElement(target)
    if (!el)
      return

    if (el === event.target || event.composedPath().includes(el))
      return

    handler(event)
  }

  const stop = useEventListener(window, event, listener, { passive: true })

  tryOnUnmounted(stop)

  return stop
}
