import { onMounted, onUnmounted } from '../api'

export function useEventListener (
  type: string,
  listener: EventListenerOrEventListenerObject,
  target: EventTarget = window,
  options?: boolean | AddEventListenerOptions,
) {
  onMounted(() => {
    target.addEventListener(type, listener, options)
  })

  onUnmounted(() => {
    target.removeEventListener(type, listener, options)
  })
}
