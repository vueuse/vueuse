/** ----------------- warning ------------------- */
//        The implementation test failed.         //
/** ----------------- warning ------------------- */
import { tryOnUnmounted } from '@vueuse/shared'

export interface EventBusKey<T> extends Symbol {}

export type EventBusObserverItem = Map<PropertyKey, Function>
export type OffCallback = () => void
export interface UseEventBusReturn<Message> {
  /**
   * once event, Same as on, but it will only be called once.
   * @param listener watch listener callback.
   * @returns close the current `once` callback.
   */
  once: (listener: (message: Message) => void) => OffCallback
  /**
   * on event, When calling emit, the listener will execute.
   * @param listener watch listener callback.
   * @returns close the current `on` callback.
   */
  on: (listener: (message: Message) => void) => OffCallback
  /**
   * emit event, The corresponding event listener will execute.
   * @param message message sent.
   */
  emit: (message?: Message) => void
  /**
   * close the corresponding listener.
   * @param token event | token.
   */
  off: (token?: PropertyKey) => void
}

useEventBus.observers = new Map<PropertyKey, EventBusObserverItem>()
useEventBus.subject = {
  attach: (event: string, listener: (message: any) => void) => {
    const key = Symbol('observer__key')
    if (useEventBus.observers.has(event))
      useEventBus.observers.get(event)!.set(key, listener)
    else
      useEventBus.observers.set(event, new Map([[key, listener]]))
    return key
  },
  detach: (token: PropertyKey | Function) => {
    if (typeof token !== 'function' && useEventBus.observers.has(token)) {
      useEventBus.observers.delete(token)
      return
    }
    useEventBus.observers.forEach((observer, event) => {
      for (const [key, value] of observer.entries()) {
        if (!(key === token || value === token))
          continue
        if (!observer.size)
          useEventBus.observers.delete(event)
        break
      }
    })
  },
  notify: (event: PropertyKey, message?: any) => {
    if (!useEventBus.observers.has(event))
      return
    useEventBus.observers.get(event)!.forEach(listener => listener(message))
  },
}

/**
 * This is a basic event bus, which is generally used to transfer data across components.
 *
 * @see https://vueuse.org/useEventBus
 * @param event
 */
export function useEventBus<Message = any>(eventKey: EventBusKey<Message> | string | number): UseEventBusReturn<Message> {
  const unTokens = new Set<symbol>()

  function once(listener: (message: any) => void) {
    const unToken = useEventBus.subject.attach(<string>eventKey, (_message) => {
      listener(_message)
      off(unToken)
    })
    unTokens.add(unToken)
    return () => off(unToken)
  }

  function on(listener: (message: any) => void) {
    const unToken = useEventBus.subject.attach(<string>eventKey, listener)
    unTokens.add(unToken)
    return () => off(unToken)
  }

  function emit(message?: any) {
    return useEventBus.subject.notify(<string>eventKey, message)
  }

  function off(token?: PropertyKey) {
    if (typeof token === 'undefined') {
      unTokens.forEach(token => off(token))
      return
    }
    if (typeof token === 'symbol' && unTokens.has(token))
      unTokens.delete(token)
    useEventBus.subject.detach(<string>(token || event))
  }

  tryOnUnmounted(off)

  return { on, emit, off, once }
}
