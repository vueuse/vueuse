/**
 * The source code for this function was inspired by vue-apollo's `useEventHook` util
 * https://github.com/vuejs/vue-apollo/blob/v4/packages/vue-apollo-composable/src/util/useEventHook.ts
 */
import { tryOnScopeDispose } from '../tryOnScopeDispose'

type Callback<T> = T extends void ? () => void : (param: T) => void
export type EventHookOn<T = any> = (fn: Callback<T>) => { off: () => void }
export type EventHookOff<T = any> = (fn: Callback<T>) => void
export type EventHookTrigger<T = any> = (param?: T) => Promise<unknown[]>

export interface EventHook<T = any> {
  on: EventHookOn<T>
  off: EventHookOff<T>
  trigger: EventHookTrigger<T>
}

/**
 * Utility for creating event hooks
 *
 * @see https://vueuse.org/createEventHook
 */
export function createEventHook<T = any>(): EventHook<T> {
  const fns: Set<Callback<T>> = new Set()

  const off = (fn: Callback<T>) => {
    fns.delete(fn)
  }

  const on = (fn: Callback<T>) => {
    fns.add(fn)
    const offFn = () => off(fn)

    tryOnScopeDispose(offFn)

    return {
      off: offFn,
    }
  }

  const trigger: EventHookTrigger<T> = (param?: T) => {
    return Promise.all(Array.from(fns).map(fn => param ? fn(param) : (fn as Callback<void>)()))
  }

  return {
    on,
    off,
    trigger,
  }
}
