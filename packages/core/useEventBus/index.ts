import { tryOnUnmounted } from '@vueuse/shared'

export interface UseEventBusReturn<Message> {
  /**
   * once event, Same as on, but it will only be called once
   */
  once: (listener: (message: Message) => void) => symbol
  /**
   * on event, When calling emit, the listener will execute.
   */
  on: (listener: (message: Message) => void) => symbol
  /**
   * emit event, The corresponding event listener will execute.
   */
  emit: (message?: Message) => void
  /**
   * off event | token, Close the corresponding listener.
   */
  off: (token?: symbol | string) => void
}

export type UseEventBusItem<T = any> = Map<symbol | string, (value: T) => void>
export type UseEventBusObservers = Record<string, UseEventBusItem>

useEventBus.observers = {} as UseEventBusObservers
useEventBus.subject = {
  attach: (event: string, listener: (message: any) => void) => {
    const id = Symbol('observer__id')
    if (useEventBus.observers[event])
      useEventBus.observers[event].set(id, listener)
    else
      useEventBus.observers[event] = new Map([[id, listener]])
    return id
  },
  detach: (token: string) => {
    if (useEventBus.observers[token]) {
      delete useEventBus.observers[token]
      return
    }
    for (const [key, value] of Object.entries(useEventBus.observers)) {
      if (value.has(token))
        value.delete(token)
      if (!value.size)
        delete useEventBus.observers[key]
    }
  },
  notify: (event: string, message?: any) => {
    if (!useEventBus.observers[event])
      return
    useEventBus.observers[event].forEach(listener => listener(message))
  },
}

/**
 * This is a basic event bus, which is generally used to transfer data across components.
 *
 * @see https://vueuse.org/useEventBus
 * @param event
 */
export function useEventBus<Message = any>(event: string | symbol): UseEventBusReturn<Message> {
  const unTokens = new Set<symbol>()

  function once(listener: (message: any) => void) {
    const unToken = useEventBus.subject.attach(<string>event, (_message) => {
      listener(_message)
      off(unToken)
    })
    unTokens.add(unToken)
    return unToken
  }
  function on(listener: (message: any) => void) {
    const unToken = useEventBus.subject.attach(<string>event, listener)
    unTokens.add(unToken)
    return unToken
  }
  function emit(message?: any) {
    return useEventBus.subject.notify(<string>event, message)
  }
  function off(token?: string | symbol) {
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
