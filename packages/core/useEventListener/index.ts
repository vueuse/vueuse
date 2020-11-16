import { Fn, isString, tryOnUnmounted } from '@vueuse/shared'
import { defaultWindow } from '../_configurable'

interface InferEventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any
  removeEventListener(event: Events, fn?: any, options?: any): any
}

export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof WindowEventMap>(event: E, listener: (this: Window, ev: WindowEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 2: Explicitly Window target
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof WindowEventMap>(target: Window, event: E, listener: (this: Window, ev: WindowEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 3: Explicitly Document target
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof DocumentEventMap>(target: Document, event: E, listener: (this: Document, ev: DocumentEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 4: Custom event target with event type infer
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<Names extends string>(target: InferEventTarget<Names>, event: Names, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 5: Custom event target fallback
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener(target: EventTarget, event: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Fn

export function useEventListener(...args: any[]) {
  let target: EventTarget | undefined
  let event: string
  let listener: any
  let options: any

  if (isString(args[0])) {
    [event, listener, options] = args
    target = defaultWindow
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
