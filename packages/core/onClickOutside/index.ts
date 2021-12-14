import { ref } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 * Listen for clicks outside of an element.
 *
 * @see https://vueuse.org/onClickOutside
 * @param target
 * @param handler
 * @param options
 */
export function onClickOutside(
  target: MaybeElementRef,
  handler: (evt: PointerEvent) => void,
  options: ConfigurableWindow = {},
) {
  const { window = defaultWindow } = options

  if (!window)
    return

  const shouldListen = ref(true)

  const listener = (event: PointerEvent) => {
    const el = unrefElement(target)

    if (!el || el === event.target || event.composedPath().includes(el) || !shouldListen.value)
      return

    handler(event)
  }

  const cleanup = [
    useEventListener(window, 'click', listener, { passive: true, capture: true }),
    useEventListener(window, 'pointerdown', (e) => {
      const el = unrefElement(target)
      shouldListen.value = !!el && !e.composedPath().includes(el)
    }, { passive: true }),
  ]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
