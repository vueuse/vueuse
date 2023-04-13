import type { Fn } from '@vueuse/shared'
import { getCurrentScope } from 'vue-demi'
import { events } from './internal'

export type EventBusListener<T = unknown, P = any> = (event: T, payload?: P) => void
export type EventBusEvents<T, P = any> = Set<EventBusListener<T, P>>

// eslint-disable-next-line unused-imports/no-unused-vars
export interface EventBusKey<T> extends Symbol { }

export type EventBusIdentifier<T = unknown> = EventBusKey<T> | string | number

export interface UseEventBusReturn<T, P> {
  /**
   * Subscribe to an event. When calling emit, the listeners will execute.
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  on: (listener: EventBusListener<T, P>) => Fn
  /**
   * Similar to `on`, but only fires once
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  once: (listener: EventBusListener<T, P>) => Fn
  /**
   * Emit an event, the corresponding event listeners will execute.
   * @param event data sent.
   */
  emit: (event?: T, payload?: P) => void
  /**
   * Remove the corresponding listener.
   * @param listener watch listener.
   */
  off: (listener: EventBusListener<T>) => void
  /**
   * Clear all events
   */
  reset: () => void
}

export function useEventBus<T = unknown, P = any>(key: EventBusIdentifier<T>): UseEventBusReturn<T, P> {
  const scope = getCurrentScope()
  function on(listener: EventBusListener<T, P>) {
    const listeners = (events.get(key) || new Set())
    listeners.add(listener)
    events.set(key, listeners)

    const _off = () => off(listener)
    // auto unsubscribe when scope get disposed
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore vue3 and vue2 mis-align
    scope?.cleanups?.push(_off)
    return _off
  }

  function once(listener: EventBusListener<T, P>) {
    function _listener(...args: any[]) {
      off(_listener)
      // @ts-expect-error cast
      listener(...args)
    }
    return on(_listener)
  }

  function off(listener: EventBusListener<T>): void {
    const listeners = events.get(key)
    if (!listeners)
      return

    listeners.delete(listener)

    if (!listeners.size)
      reset()
  }

  function reset() {
    events.delete(key)
  }

  function emit(event?: T, payload?: P) {
    events.get(key)?.forEach(v => v(event, payload))
  }

  return { on, once, off, emit, reset }
}
