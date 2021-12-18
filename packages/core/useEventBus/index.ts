import type { Fn } from '@vueuse/shared'
import { getCurrentScope } from 'vue-demi'
import { events } from './internal'

export type EventBusListener<T = unknown> = (event: T) => void
export type EventBusEvents<T> = EventBusListener<T>[]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface EventBusKey<T> extends Symbol { }

export type EventBusIdentifier<T = unknown> = EventBusKey<T> | string | number

export interface UseEventBusReturn<T> {
  /**
   * Subscribe to an event. When calling emit, the listeners will execute.
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  on: (listener: EventBusListener<T>) => Fn
  /**
   * Similar to `on`, but only fires once
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  once: (listener: EventBusListener<T>) => Fn
  /**
   * Emit an event, the corresponding event listeners will execute.
   * @param event data sent.
   */
  emit: (event?: T) => void
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

export function useEventBus<T = unknown>(key: EventBusIdentifier<T>): UseEventBusReturn<T> {
  const scope = getCurrentScope()

  function on(listener: EventBusListener<T>) {
    const listeners = events.get(key) || []
    listeners.push(listener)
    events.set(key, listeners)

    const _off = () => off(listener)
    // auto unsubscribe when scope get disposed
    scope?.cleanups.push(_off)
    return _off
  }

  function once(listener: EventBusListener<T>) {
    function _listener(...args: any[]) {
      off(_listener)
      // @ts-expect-error
      listener(...args)
    }
    return on(_listener)
  }

  function off(listener: EventBusListener<T>): void {
    const listeners = events.get(key)
    if (!listeners)
      return

    const index = listeners.indexOf(listener)
    if (index > -1)
      listeners.splice(index, 1)
    if (!listeners.length)
      events.delete(key)
  }

  function reset() {
    events.delete(key)
  }

  function emit(event?: T) {
    events.get(key)?.forEach(v => v(event))
  }

  return { on, once, off, emit, reset }
}
