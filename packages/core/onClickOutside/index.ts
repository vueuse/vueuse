import { Fn, tryOnUnmounted } from '@vueuse/shared'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

const events = ['mousedown', 'touchstart', 'pointerdown'] as const
type EventType = WindowEventMap[(typeof events)[number]]

/**
 * Listen for clicks outside of an element.
 *
 * @see   {@link https://vueuse.js.org/onClickOutside}
 * @param target
 * @param handler
 * @param options
 */
export function onClickOutside(
  target: MaybeElementRef,
  handler: (evt: EventType) => void,
  options: ConfigurableWindow = {},
) {
  const { window = defaultWindow } = options

  if (!window)
    return

  const listener = (event: EventType) => {
    const el = unrefElement(target)
    if (!el)
      return

    if (el === event.target || event.composedPath().includes(el))
      return

    handler(event)
  }

  let disposables: Fn[] = events
    .map(event => useEventListener(window, event, listener, { passive: true }))

  const stop = () => {
    disposables.forEach(stop => stop())
    disposables = []
  }

  tryOnUnmounted(stop)

  return stop
}
