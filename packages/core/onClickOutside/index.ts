import { Fn, MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'
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
  target: MaybeRef<Element | null | undefined>,
  handler: (evt: EventType) => void,
  options: ConfigurableWindow = {},
) {
  const { window = defaultWindow } = options

  if (!window)
    return

  const targetRef = ref(target)

  const listener = (event: EventType) => {
    if (!targetRef.value)
      return

    const elements = event.composedPath()
    if (targetRef.value === event.target || elements.includes(targetRef.value!))
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
