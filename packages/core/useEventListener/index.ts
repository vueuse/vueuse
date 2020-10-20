import { tryOnMounted, tryOnUnmounted } from '@vueuse/shared'

export function useEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void
export function useEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions, target?: Document): void
export function useEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions, target?: EventTarget): void
export function useEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  target: EventTarget = window,
) {
  tryOnMounted(() => {
    target.addEventListener(type, listener, options)
  })

  tryOnUnmounted(() => {
    target.removeEventListener(type, listener, options)
  })
}
