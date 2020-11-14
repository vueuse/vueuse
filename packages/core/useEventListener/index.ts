import { Fn, isClient, isString, tryOnUnmounted } from '@vueuse/shared'

interface InferEventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any
  removeEventListener(event: Events, fn?: any, options?: any): any
}

export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap

// overload 1: window (omitted)
export function useEventListener<E extends keyof WindowEventMap>(event: E, listener: (this: Window, ev: WindowEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn
// overload 2: window
export function useEventListener<E extends keyof WindowEventMap>(target: Window, event: E, listener: (this: Window, ev: WindowEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn
// overload 3: document
export function useEventListener<E extends keyof DocumentEventMap>(target: Document, event: E, listener: (this: Document, ev: DocumentEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn
// overload 4: custom event targets
export function useEventListener<Names extends string>(target: InferEventTarget<Names>, event: Names, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Fn
// overload 5: any event target you believe working
export function useEventListener(target: EventTarget, event: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Fn

// implementation
export function useEventListener(...args: any[]) {
  let target: EventTarget | undefined, event: string, listener: any, options: any

  if (isString(args[0])) {
    [event, listener, options] = args
    target = isClient ? window : undefined
  }
  else {
    [target, event, listener, options] = args
  }

  if (!target)
    return

  let stopped = false

  target.addEventListener(event, listener, options)

  const stop = () => {
    if (stopped)
      return
    target!.removeEventListener(event, listener, options)
    stopped = true
  }

  tryOnUnmounted(stop)

  return stop
}
