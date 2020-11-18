import { Fn, isClient, MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'

const events = ['mousedown', 'touchstart'] as const

/**
 * Listen for clicks outside of an element.
 *
 * @see   {@link https://vueuse.js.org/useClickOutside}
 * @param target
 * @param handler
 */
export function useClickOutside(
  target: MaybeRef<Element | null | undefined>,
  handler: EventListener,
) {
  if (!isClient)
    return

  const targetRef = ref(target)

  const listener = (event: MouseEvent | TouchEvent) => {
    const elements = event.composedPath()
    if (targetRef.value === event.target || elements.includes(targetRef.value!))
      return

    handler(event)
  }

  let listeners: Fn[] = []

  const stopListeners = () => {
    listeners.forEach(stop => stop())
    listeners = []
  }

  tryOnUnmounted(stopListeners)

  watch(
    targetRef,
    () => {
      if (!targetRef.value) {
        stopListeners()
        return
      }

      events.forEach((event) => {
        listeners.push(useEventListener(event, listener, { passive: true }))
      })
    },
    { immediate: true },
  )
}
