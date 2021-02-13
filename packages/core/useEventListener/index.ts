import { Fn, isString, MaybeRef, noop, tryOnUnmounted } from '@vueuse/shared'
import { unref, watch } from 'vue-demi'
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
export function useEventListener(target: MaybeRef<EventTarget>, event: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): Fn

export function useEventListener(...args: any[]) {
  let target: MaybeRef<EventTarget> | undefined
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

  let cleanup = noop

  const stopWatch = watch(
    () => unref(target),
    (el) => {
      cleanup()
      if (!el)
        return

      el.addEventListener(event, listener, options)

      cleanup = () => {
        el.removeEventListener(event, listener, options)
        cleanup = noop
      }
    },
    { immediate: true },
  )

  const stop = () => {
    stopWatch()
    cleanup()
  }

  tryOnUnmounted(stop)

  return stop
}
