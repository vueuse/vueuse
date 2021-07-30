import { tryOnUnmounted } from '@vueuse/shared'
export type OffCallback = () => void
export type EventBusListener<T = any> = (event: T) => void
export interface EventBusKey<T> extends Symbol {}
export interface UseEventBusReturn<T> {
  /**
   * once event, Same as on, but it will only be called once.
   * @param listener watch listener callback.
   * @returns close the current `once` callback.
   */
  once: (listener: EventBusListener<T>) => OffCallback
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
  off: (type?: PropertyKey) => void
}

useEventBus.observers = new Map<PropertyKey, Map<PropertyKey, EventBusListener>>()
useEventBus.subject = {
  attach: (type: PropertyKey, listener: (message: any) => void) => {
    const { observers } = useEventBus
    const key = Symbol('observer__key')
    observers.has(type)
      ? observers.get(type)!.set(key, listener)
      : observers.set(type, new Map([[key, listener]]))
    return key
  },
  detach: (token: PropertyKey) => {
    const { observers } = useEventBus
    if (observers.delete(token))
      return
    observers.forEach((observer, event) => {
      if (observer.delete(token) && !observer.size)
        observers.delete(event)
    })
  },
  notify: (type: PropertyKey, message?: any) => {
    const { observers } = useEventBus
    observers.get(type)?.forEach(listener => listener(message))
  },
}

/**
 * This is a basic event bus, which is generally used to transfer data across components.
 *
 * @see https://vueuse.org/useEventBus
 * @param event
 */
export function useEventBus<T = any>(type: EventBusKey<T> | string | number): UseEventBusReturn<T> {
  const { attach, notify, detach } = useEventBus.subject
  const unTokens = new Set<symbol>()
  function once(listener: EventBusListener<T>) {
    const unToken = attach(<PropertyKey>type, (_message) => {
      listener(_message)
      off(unToken)
    })
    unTokens.add(unToken)
    return () => off(unToken)
  }

  function on(listener: EventBusListener<T>) {
    const unToken = attach(<PropertyKey>type, listener)
    unTokens.add(unToken)
    return () => off(unToken)
  }

  function emit(message?: T) {
    return notify(<PropertyKey>type, message)
  }

  function off(token?: PropertyKey) {
    if (typeof token === 'undefined') {
      unTokens.forEach(token => off(token))
      return
    }
    unTokens.delete(<symbol>token)
    detach(<string>(token || type))
  }

  tryOnUnmounted(off)

  return { on, emit, off, once }
}
