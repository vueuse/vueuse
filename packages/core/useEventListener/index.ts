import type { Fn, MaybeArray, MaybeComputedRef } from '@vueuse/shared'
import { isString, noop, tryOnScopeDispose } from '@vueuse/shared'
import { watch } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { defaultWindow } from '../_configurable'

interface InferEventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any
  removeEventListener(event: Events, fn?: any, options?: any): any
}

export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap

export interface GeneralEventListener<E = Event> {
  (evt: E): void
}

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 * @see https://vueuse.org/useEventListener
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof WindowEventMap>(
  event: MaybeArray<E>,
  listener: MaybeArray<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 2: Explicitly Window target
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: MaybeArray<E>,
  listener: MaybeArray<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 3: Explicitly Document target
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: MaybeArray<E>,
  listener: MaybeArray<(this: Document, ev: DocumentEventMap[E]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 4: Custom event target with event type infer
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<Names extends string, EventType = Event>(
  target: InferEventTarget<Names>,
  event: MaybeArray<Names>,
  listener: MaybeArray<GeneralEventListener<EventType>>,
  options?: boolean | AddEventListenerOptions
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 5: Custom event target fallback
 *
 * @see https://vueuse.org/useEventListener
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export function useEventListener<EventType = Event>(
  target: MaybeComputedRef<EventTarget | null | undefined>,
  event: MaybeArray<string>,
  listener: MaybeArray<GeneralEventListener<EventType>>,
  options?: boolean | AddEventListenerOptions
): Fn

export function useEventListener(...args: any[]) {
  let target: MaybeComputedRef<EventTarget> | undefined
  let events: MaybeArray<string>
  let listeners: MaybeArray<any>
  let options: any

  if (isString(args[0]) || Array.isArray(args[0])) {
    [events, listeners, options] = args
    target = defaultWindow
  }
  else {
    [target, events, listeners, options] = args
  }

  if (!target)
    return noop

  if (!Array.isArray(events))
    events = [events]
  if (!Array.isArray(listeners))
    listeners = [listeners]

  let cleanup = noop

  const register = (el: any, event: string, listener: any) => {
    el.addEventListener(event, listener, options)
    return () => {
      el.removeEventListener(event, listener, options)
    }
  }

  const stopWatch = watch(
    () => unrefElement(target as unknown as MaybeElementRef),
    (el) => {
      cleanup()
      if (!el)
        return

      const cleanups = (events as string[]).map((event) => {
        return (listeners as []).map(listener => register(el, event, listener))
      }).flat()

      cleanup = () => {
        cleanups.forEach(unregister => unregister())
        cleanup = noop
      }
    },
    { immediate: true, flush: 'post' },
  )

  const stop = () => {
    stopWatch()
    cleanup()
  }

  tryOnScopeDispose(stop)

  return stop
}
