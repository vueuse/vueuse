import { Fn } from '@vueuse/shared'
import { getCurrentInstance, onUnmounted } from 'vue'
import { events } from './internal'

export type EventBusListener<T = unknown> = (event: T) => void
export type EventBusEvents<T> = EventBusListener<T>[]

export interface EventBusKey<T> extends Symbol { }
export type EventBusIdentifer<T = unknown> = EventBusKey<T> | string | number

export interface UseEventBusReturn<T> {
  /**
   * Subscribe to an event. When calling emit, the listeners will execute.
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  on: (listener: EventBusListener<T>) => Fn
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

export function useEventBus<T = unknown>(key: EventBusIdentifer<T>): UseEventBusReturn<T> {
  const vm = getCurrentInstance()

  function on(listener: EventBusListener<T>) {
    const listeners = events.get(key) || []
    listeners.push(listener)
    events.set(key, listeners)

    const _off = () => off(listener)
    // auto unsubscribe when vm get unmounted
    if (vm) onUnmounted(_off, vm)
    return _off
  }

  function off(listener: EventBusListener<T>): void {
    const listeners = events.get(key)
    if (!listeners)
      return
    if (typeof listener === 'function') {
      const index = listeners.indexOf(listener)
      if (index > -1)
        listeners.splice(index, 1)
    }
    if (!listeners.length)
      events.delete(key)
  }

  function reset() {
    events.delete(key)
  }

  function emit(event?: T) {
    events.get(key)?.forEach(v => v(event))
  }

  return { on, off, emit, reset }
}
