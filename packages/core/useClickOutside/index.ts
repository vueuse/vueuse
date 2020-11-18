import { Fn, isClient, MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'

const events = ['mousedown', 'touchstart'] as const
type EventType = MouseEvent | TouchEvent

/**
 * Listen for clicks outside of an element.
 *
 * @see   {@link https://vueuse.js.org/onClickOutside}
 * @param target
 * @param handler
 */
export function onClickOutside(
  target: MaybeRef<Element | null | undefined>,
  handler: (evt: EventType) => void,
) {
  if (!isClient)
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

  let disposables: Fn[] = []

  events.forEach((event) => {
    disposables.push(useEventListener(event, listener, { passive: true }))
  })

  const stop = () => {
    disposables.forEach(stop => stop())
    disposables = []
  }

  tryOnUnmounted(stop)

  return stop
}
