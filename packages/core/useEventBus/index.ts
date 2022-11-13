import type { Fn } from '@vueuse/shared'
import { getCurrentScope } from 'vue-demi'
import { isFunction } from '../../shared/utils/is'
import { events, specialEvents } from './internal'

export type EventBusListener<T = unknown, P = any> = (event: T, payload?: P) => void
export type EventBusEvents<T, P = any> = EventBusListener<T, P>[]

export type EventBusSpecialEvents<T = unknown> = Map<EventBusIdentifier<T>, Record<string | number | symbol, EventBusListener<any, any>[]>>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface EventBusKey<T> extends Symbol { }

export type EventBusIdentifier<T = unknown> = EventBusKey<T> | string | number

export type EventBusSubscribeFn<T, P> = (listener: EventBusListener<T, P>) => Fn
export type EventBusSubscribeSpecialEventFn<T, P> = (event: T, specialEventListener: EventBusListener<T, P>) => Fn

export type EventBusOffFn<T> = (listener: EventBusListener<T>) => void
export type EventBusOffSpecialEventFn<T> = (event: T, listener: EventBusListener<T>) => void

export interface UseEventBusReturn<T, P> {
  /**
   * Subscribe to an event. When calling emit, the listeners will execute.
   * @param actor watch listener or defined event for specialEventListener.
   * @param specialEventListener available only if actor is not a function. It's listener for defined event.
   * @returns a stop function to remove the current callback.
   */
  on: (actor: EventBusListener<T, P> | T, specialEventListener?: EventBusListener<T, P>) => Fn
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
   * @param actor watch listener or defined event for specialEventListener
   * @param specialEventListener available only if actor is not a function. It's listener for defined event.
   */
  off: (actor: T | EventBusListener<T>, specialEventListener?: EventBusListener<T>) => void
  /**
   * Clear all events
   */
  reset: () => void
}

export function useEventBus<T = any, P = any>(key: EventBusIdentifier<T>): UseEventBusReturn<T, P> {
  const scope = getCurrentScope()

  function onSpecial(event: T, listener: EventBusListener<T, P>) {
    const _off = () => offSpecial(event, listener)

    if (!specialEvents.get(key))
      specialEvents.set(key, {})

    if (!specialEvents.get(key)![event as any])
      specialEvents.get(key)![event as any] = []

    specialEvents.get(key)![event as any].push(listener)

    return _off
  }

  function on(actor: EventBusListener<T, P> | T, specialEventListener?: EventBusListener<T, P>) {
    if (!isFunction(actor))
      return onSpecial(actor, specialEventListener!)

    const listeners = events.get(key) || []
    listeners.push(actor)
    events.set(key, listeners)

    const _off = () => off(actor)
    // auto unsubscribe when scope get disposed
    // @ts-expect-error vue3 and vue2 mis-align
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

  function offSpecial(event: T, listener: EventBusListener<T, P>) {
    const listeners = (specialEvents.get(key) || {} as any)[event]

    if (!listeners)
      return

    const index = listeners.indexOf(listener)

    if (index > -1)
      listeners.splice(index, 1)
  }

  function off(actor: T | EventBusListener<T>, listener?: EventBusListener<T>): void {
    if (!isFunction(actor))
      return offSpecial(actor, listener!)

    const listeners = events.get(key)
    if (!listeners)
      return

    const index = listeners.indexOf(actor)
    if (index > -1)
      listeners.splice(index, 1)
    if (!listeners.length)
      events.delete(key)
  }

  function reset() {
    events.delete(key)
    specialEvents.delete(key)
  }

  function emit(event?: T, payload?: P) {
    const special = event ? specialEvents.get(key) : undefined

    if (special)
      special[event as any]?.forEach(cb => cb(event, payload))

    events.get(key)?.forEach(v => v(event, payload))
  }

  return { on, once, off, emit, reset }
}
