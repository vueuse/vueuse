import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export type OnClickOutsideEvents = Pick<WindowEventMap, 'click' | 'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'pointerdown' | 'pointerup'>
export interface OnClickOutsideOptions<E extends keyof OnClickOutsideEvents> extends ConfigurableWindow {
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
export function onClickOutside<E extends keyof OnClickOutsideEvents = 'pointerdown'>(
  target: MaybeElementRef,
  handler: (evt: OnClickOutsideEvents[E]) => void,
  options: OnClickOutsideOptions<E> = {},
) {
  const { window = defaultWindow, event = 'pointerdown' } = options

  if (!window)
    return

  const listener = (event: OnClickOutsideEvents[E]) => {
    const el = unrefElement(target)

    if (!el || el === event.target || eventPath(event).includes(el))
      return

    handler(event)
  }

  function eventPath(event: OnClickOutsideEvents[E]) {
    // @ts-ignore
    const path = ((event.composedPath && event.composedPath()) || event.path) as HTMLElement[] | undefined

    if (path != null)
      return path

    function getParents(node: HTMLElement, memo: HTMLElement[] = []): HTMLElement[] {
      const parentNode = node.parentNode as HTMLElement | null

      return parentNode
        ? getParents(parentNode, memo.concat([parentNode]))
        : memo
    }

    return [event.target].concat(getParents(event.target as HTMLElement))
  }

  return useEventListener(window, event, listener, { passive: true })
}
