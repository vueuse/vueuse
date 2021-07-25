import { tryOnUnmounted } from '@vueuse/shared'
import { getCurrentInstance } from 'vue'

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
  publish: (message: Message) => void
  /**
   * unsubscribe event | subscribeToken
   */
  unsubscribe: (token: symbol | string) => void
}

usePubsub.observes = {} as UsePubsubObserves
usePubsub.watcher = {
  subscribe: <T>(event: string, execute: (message: T) => void) => {
    const id = Symbol('observeId')
    if (typeof usePubsub.observes[event] === 'undefined')
      usePubsub.observes[event] = new Map([[id, execute]])
    else
      usePubsub.observes[event].set(id, execute)
    return id
  },
  publish: <T>(event: string, message: T) => {
    if (!usePubsub.observes[event])
      return
    [...usePubsub.observes[event]?.values()]
      .forEach(execute => execute(message))
  },
  unsubscribe: (token: string) => {
    if (usePubsub.observes[token]) {
      delete usePubsub.observes[token]
      return
    }
    for (const observeItems of Object.values(usePubsub.observes))
      observeItems.has(token) && observeItems.delete(token)
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
  const isSetup = !!getCurrentInstance()

  function subscribe<Message>(execute: (message: Message) => void) {
    const token = usePubsub.watcher.subscribe(<string>event, execute)
    isSetup && unsubTokens.add(token)
    return token
  }
  function publish(message: Message) {
    return usePubsub.watcher.publish(<string>event, message)
  }
  function unsubscribe(token?: string | symbol) {
    if (isSetup && typeof token === 'symbol')
      unsubTokens.has(token) && unsubTokens.delete(token)

    return usePubsub.watcher.unsubscribe(<string>(token || event))
  }

  tryOnUnmounted(() => {
    [...unsubTokens].forEach(token => unsubscribe(token))
  })

  return {
    subscribe,
    publish,
    unsubscribe,
  }
}
