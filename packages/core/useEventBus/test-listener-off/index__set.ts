/** ----------------- warning ------------------- */
//        The implementation test failed.         //
/** ----------------- warning ------------------- */
import { tryOnUnmounted } from '@vueuse/shared'

export interface EventBusKey<T> extends Symbol {}

export type OffCallback = () => void
export interface UseEventBusReturn<Message> {
  /**
   * once event, Same as on, but it will only be called once.
   * @param listener watch listener callback.
   * @returns close the current `once` callback.
   */
  // once: (listener: (message: Message) => void) => OffCallback
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
  off: (token?: PropertyKey | Function) => void
}

useEventBus.observers = new Map<PropertyKey, Set<Function>>()
useEventBus.subject = {
  attach: (event: string, listener: (message: any) => void) => {
    const key = Symbol('observer__key')
    if (useEventBus.observers.has(event))
      useEventBus.observers.get(event)!.add(listener)
    else
      useEventBus.observers.set(event, new Set([listener]))
    return key
  },
  detach: (token: PropertyKey | Function) => {
    if (typeof token !== 'function') {
      if (useEventBus.observers.has(token))
        useEventBus.observers.delete(token)
    }
    else {
      useEventBus.observers.forEach((observer, key) => {
        if (observer.has(token))
          observer.delete(token)
        if (observer.size === 0)
          useEventBus.observers.delete(key)
      })
    }
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
  // function once(listener: (message: any) => void) {
  //   const onceListener = (_message: any) => {
  //     listener(_message)
  //     off(onceListener)
  //   }
  //   useEventBus.subject.attach(<any>eventKey, onceListener.bind(listener))
  //   return () => off(onceListener)
  // }

  function on(listener: (message: any) => void) {
    useEventBus.subject.attach(<any>eventKey, listener)
    return () => off(listener)
  }

  function emit(message?: any) {
    return useEventBus.subject.notify(<any>eventKey, message)
  }

  function off(token?: PropertyKey | Function) {
    useEventBus.subject.detach(<any>(token || eventKey))
  }

  tryOnUnmounted(off)

  return { on, emit, off }
}
