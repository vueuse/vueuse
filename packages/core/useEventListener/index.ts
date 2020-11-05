import { isClient, tryOnUnmounted } from '@vueuse/shared'

export interface EventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any
  removeEventListener(name: Events, fn?: any, options?: any): any
}

// overload 1: window
export function useEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions, target?: Window): void
// overload 2: document
export function useEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions, target?: Document): void
// overload 3: custom event targets
export function useEventListener<Names extends string>(type: Names, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions, target?: EventTarget<Names>): void
// overload 4: any event target you believe working
export function useEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions, target?: any): void

// implementation
export function useEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  target: EventTarget<any> | undefined = isClient ? window : undefined,
) {
  if (!target)
    return

  target.addEventListener(type, listener, options)

  tryOnUnmounted(() => {
    target.removeEventListener(type, listener, options)
  })
}
