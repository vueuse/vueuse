import { tryOnUnmounted } from '@vueuse/shared'
import { readonly, DeepReadonly } from 'vue'

export type OffCallback = () => void
export type EventBusListener<T = any> = (event: T) => void
export type EventBusEvents = DeepReadonly<{ BUS_KEY: symbol; listener: EventBusListener }>[]

export interface EventBusKey<T> extends Symbol { }
export type EventBusType<T = any> = EventBusKey<T> | string | number

export interface UseEventBusReturn<T> {
  /**
  /**
   * on event, When calling emit, the listener will execute.
   * @param listener watch listener callback.
   * @returns close the current `on` callback.
   */
  on: (listener: EventBusListener<T>) => OffCallback
  /**
   * emit event, The corresponding event listener will execute.
   * @param event data sent.
   */
  emit: (event?: T) => void
  /**
   * close the corresponding listener.
   * @param type.
   */
  off: (sign?: EventBusListener | EventBusType) => void
  /**
   * Stores all event and listener Map data
   */
  all: Map<EventBusType, EventBusEvents>
}

const all = new Map<EventBusType, EventBusEvents>()

export function useEventBus<T = any>(key: string | number | EventBusKey<T>): UseEventBusReturn<T> {
  const BUS_KEY = Symbol('bus-key')

  function on(listener: EventBusListener<T>) {
    const listeners = all.get(key) || []
    listeners.push(readonly({ BUS_KEY, listener }))
    all.set(key, listeners)
    return () => off(listener)
  }

  function off(sign?: EventBusListener<T> | EventBusType<T>): void {
    const listeners = all.get(key) || []
    if (typeof sign === 'undefined') return [...listeners].forEach(v => (v.BUS_KEY === BUS_KEY && off(v.listener)))
    if (typeof sign !== 'function') all.delete(sign)
    if (typeof sign === 'function') listeners.splice(listeners.findIndex(v => v.listener === sign), 1)
    if (!listeners.length) all.delete(key)
  }

  function emit(event?: T) {
    all.get(key)?.forEach(v => v.listener(event))
  }

  tryOnUnmounted(off)

  return { on, off, emit, all }
}
