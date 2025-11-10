import type { Arrayable, Fn } from '@vueuse/shared'
import type { MaybeRef, MaybeRefOrGetter } from 'vue'
import { isObject, toArray, tryOnScopeDispose, watchImmediate } from '@vueuse/shared'
// eslint-disable-next-line no-restricted-imports -- We specifically need to use unref here to distinguish between callbacks
import { computed, toValue, unref } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'

interface InferEventTarget<Events> {
  addEventListener: (event: Events, fn?: any, options?: any) => any
  removeEventListener: (event: Events, fn?: any, options?: any) => any
}

export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap
export type ShadowRootEventName = keyof ShadowRootEventMap

export interface GeneralEventListener<E = Event> {
  (evt: E): void
}

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 * @see https://vueuse.org/useEventListener
 */
// @ts-expect-error - TypeScript gets confused with this and can't infer the correct overload with Parameters<...>
export function useEventListener<E extends keyof WindowEventMap>(
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<Arrayable<(this: Window, ev: WindowEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
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
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<Arrayable<(this: Window, ev: WindowEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 3: Explicitly Document target
 *
 * @see https://vueuse.org/useEventListener
 */
export function useEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 4: Explicitly ShadowRoot target
 *
 * @see https://vueuse.org/useEventListener
 */
export function useEventListener<E extends keyof ShadowRootEventMap>(
  target: MaybeRefOrGetter<Arrayable<ShadowRoot> | null | undefined>,
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<Arrayable<(this: ShadowRoot, ev: ShadowRootEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 5: Explicitly HTMLElement target
 *
 * @see https://vueuse.org/useEventListener
 */
export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: MaybeRefOrGetter<Arrayable<HTMLElement> | null | undefined>,
  event: MaybeRefOrGetter<Arrayable<E>>,
  listener: MaybeRef<(this: HTMLElement, ev: HTMLElementEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 6: Custom event target with event type infer
 *
 * @see https://vueuse.org/useEventListener
 */
export function useEventListener<Names extends string, EventType = Event>(
  target: MaybeRefOrGetter<Arrayable<InferEventTarget<Names>> | null | undefined>,
  event: MaybeRefOrGetter<Arrayable<Names>>,
  listener: MaybeRef<Arrayable<GeneralEventListener<EventType>>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 7: Custom event target fallback
 *
 * @see https://vueuse.org/useEventListener
 */
export function useEventListener<EventType = Event>(
  target: MaybeRefOrGetter<Arrayable<EventTarget> | null | undefined>,
  event: MaybeRefOrGetter<Arrayable<string>>,
  listener: MaybeRef<Arrayable<GeneralEventListener<EventType>>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
): Fn

export function useEventListener(...args: Parameters<typeof useEventListener>) {
  let cleanupFunctions: Function[] = []

  // Helper function to cleanup all event listeners
  const cleanup = () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }

  // Helper function to register a single event listener
  const register = (
    el: EventTarget,
    event: string,
    listener: any,
    options: boolean | AddEventListenerOptions | undefined,
  ) => {
    // Clone options to prevent reactive changes affecting the listener removal
    const safeOptions = isObject(options) ? { ...options } : options
    el.addEventListener(event, listener, safeOptions)
    return () => el.removeEventListener(event, listener, safeOptions)
  }

  // Detect if the first argument is a target or an event name
  const firstParamTargets = computed(() => {
    const possibleTargets = toArray(toValue(args[0])).filter(Boolean)
    return possibleTargets.every(e => typeof e !== 'string') ? possibleTargets : undefined
  })

  // Watch for changes in targets, events, listeners, and options
  const stopWatch = watchImmediate(
    () => {
      const hasTargets = firstParamTargets.value
      return [
        // Resolve targets (fallback to defaultWindow if no explicit target)
        hasTargets
          ? firstParamTargets.value.map((target: any) => unrefElement(target))
          : [defaultWindow].filter(Boolean),
        // Resolve events
        toArray(toValue(hasTargets ? args[1] : args[0])) as string[],
        // Resolve listeners
        toArray(unref(hasTargets ? args[2] : args[1])) as Function[],
        // Resolve options
        toValue(hasTargets ? args[3] : args[2]) as boolean | AddEventListenerOptions | undefined,
      ] as const
    },
    ([targets, events, listeners, options]: [EventTarget[], string[], Function[], boolean | AddEventListenerOptions | undefined]) => {
      // Clean up existing listeners before setting up new ones
      cleanup()

      // Early return if any required parameter is empty
      if (!targets?.length || !events?.length || !listeners?.length)
        return

      // Register all combinations of targets, events, and listeners
      cleanupFunctions = targets.flatMap((target: EventTarget) =>
        events.flatMap((event: string) =>
          listeners.map((listener: Function) => register(target, event, listener, options)),
        ),
      )
    },
    { flush: 'post' },
  )

  const stop = () => {
    stopWatch()
    cleanup()
  }

  tryOnScopeDispose(cleanup)

  return stop
}
