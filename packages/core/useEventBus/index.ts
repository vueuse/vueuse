import type { Fn } from '@vueuse/shared'
import { getCurrentScope } from 'vue-demi'
import { events } from './internal'

export type EventBusGenerics = ((...args: any[]) => any) | any[]

export type EventBusEmitParams<T extends EventBusGenerics> = T extends (...args: any[]) => any ? Parameters<T> : T

export type EventBusListener<T extends EventBusGenerics> = T extends (...args: infer P) => void ? (...args: P) => void : T extends any[] ? (...args: T) => void : never

export type EventBusEvents = Set<Function>

export type EventBusIdentifier = Symbol | string | number

export interface UseEventBusReturn<T extends EventBusGenerics> {
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
  emit: (...args: EventBusEmitParams<T>) => void
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

export function useEventBus<T extends EventBusGenerics>(key: EventBusIdentifier): UseEventBusReturn<T> {
  const scope = getCurrentScope()
  function on(listener: EventBusListener<T>) {
    const listeners = (events.get(key) || new Set())
    listeners.add(listener)
    events.set(key, listeners)

    const _off = () => off(listener)
    // @ts-expect-error vue3 and vue2 mis-align
    scope?.cleanups?.push(_off)
    return _off
  }

  function once(listener: EventBusListener<T>) {
    function _listener(...args: EventBusEmitParams<T>) {
      off(_listener as EventBusListener<T>)
      listener(...args)
    }
    return on(_listener as EventBusListener<T>)
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

  function emit(...args: EventBusEmitParams<T>) {
    events.get(key)?.forEach(v => v(...args))
  }

  return { on, once, off, emit, reset }
}
