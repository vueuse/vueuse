import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export type OnClickOutsideEvents = Pick<WindowEventMap, 'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'pointerdown' | 'pointerup'>
export interface OnClickOutsideOptions<E extends keyof OnClickOutsideEvents> extends ConfigurableWindow {
  event?: E
  // Whether or not to listen (ignore) to browser scrollbar clicks.
  excludeScrollbar?: boolean
}

/**
 * Listen for clicks outside of an element.
 *
 * @see https://vueuse.org/onClickOutside
 * @param target
 * @param handler
 * @param options
 */
export function onClickOutside<E extends keyof OnClickOutsideEvents = 'pointerdown'>(
  target: MaybeElementRef,
  handler: (evt: OnClickOutsideEvents[E]) => void,
  options: OnClickOutsideOptions<E> = {},
) {
  const { window = defaultWindow, event = 'pointerdown', excludeScrollbar = false } = options

  if (!window)
    return

  const clickedOnScrollbar = (e: MouseEvent, target: HTMLElement): boolean => {
    const left = target.getBoundingClientRect().left
    const top = target.getBoundingClientRect().top
    const rangeX = left + target.clientWidth < e.clientX && left + target.offsetWidth >= e.clientX
    const rangeY = top + target.clientHeight < e.clientY && top + target.offsetHeight >= e.clientY
    return rangeX || rangeY
  }

  const listener = (event: OnClickOutsideEvents[E]) => {
    const el = unrefElement(target)
    if (!el)
      return
    if ((el === event.target || event.composedPath().includes(el)) && !(excludeScrollbar && (clickedOnScrollbar(event as MouseEvent, el))))
      return

    handler(event)
  }

  return useEventListener(window, event, listener, { passive: true })
}
