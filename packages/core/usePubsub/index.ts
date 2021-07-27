import { tryOnUnmounted } from '@vueuse/shared'

export type UsePubsubObserveItem<T = any> = Map<symbol | string, (value: T) => void>

export type UsePubsubObserves = Record<string, UsePubsubObserveItem>

export interface UsePubsubReturn<Message> {
  /**
   * subscribe message
   */
  subscribe: (execute: (message: Message) => void) => symbol
  /**
   * publish message
   */
  publish: (message?: Message) => void
  /**
   * unsubscribe event | subscribeToken
   */
  unsubscribe: (token?: symbol | string) => void
}

usePubsub.observes = {} as UsePubsubObserves
usePubsub.watcher = {
  subscribe: <T>(event: string, execute: (message: T) => void) => {
    const id = Symbol('observe__uid')
    if (usePubsub.observes[event])
      usePubsub.observes[event].set(id, execute)
    else
      usePubsub.observes[event] = new Map([[id, execute]])
    return id
  },
  publish: <T>(event: string, message?: T) => {
    if (!usePubsub.observes[event])
      return
    usePubsub.observes[event].forEach(execute => execute(message))
  },
  unsubscribe: (token: string) => {
    if (usePubsub.observes[token]) {
      delete usePubsub.observes[token]
      return
    }
    for (const [key, value] of Object.entries(usePubsub.observes)) {
      if (value.has(token))
        value.delete(token)
      if (!value.size)
        delete usePubsub.observes[key]
    }
  },
}

/**
 * Has basic publish and subscribe functions.
 *
 * @see https://vueuse.org/usePubsub
 * @param event
 */
export function usePubsub<Message = any>(event: string | symbol): UsePubsubReturn<Message> {
  const unsubTokens = new Set<symbol>()

  function subscribe<Message>(execute: (message: Message) => void) {
    const token = usePubsub.watcher.subscribe(<string>event, execute)
    unsubTokens.add(token)
    return token
  }

  function publish(message?: Message) {
    return usePubsub.watcher.publish(<string>event, message)
  }
  function unsubscribe(token?: string | symbol) {
    if (typeof token === 'undefined') {
      unsubTokens.forEach(token => unsubscribe(token))
      return
    }
    if (typeof token === 'symbol' && unsubTokens.has(token))
      unsubTokens.delete(token)
    usePubsub.watcher.unsubscribe(<string>(token || event))
  }

  tryOnUnmounted(unsubscribe)

  return {
    subscribe,
    publish,
    unsubscribe,
  }
}
