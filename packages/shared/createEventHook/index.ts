/**
 * The source code for this function was inspired by vue-apollo's `useEventHook` util
 * https://github.com/vuejs/vue-apollo/blob/v4/packages/vue-apollo-composable/src/util/useEventHook.ts
 */
import type { IsAny } from '../utils/types'
import { tryOnScopeDispose } from '../tryOnScopeDispose'

// any extends void = true
// so we need to check if T is any first
type Callback<T> = IsAny<T> extends true
  ? (...param: any) => void
  : (
      [T] extends [void]
        ? (...param: unknown[]) => void
        : (...param: [T, ...unknown[]]) => void
    )

export type EventHookOn<T = any> = (fn: Callback<T>) => { off: () => void }
export type EventHookOff<T = any> = (fn: Callback<T>) => void
export type EventHookTrigger<T = any> = (...param: IsAny<T> extends true ? unknown[] : [T, ...unknown[]]) => Promise<unknown[]>

export interface EventHook<T = any> {
  on: EventHookOn<T>
  off: EventHookOff<T>
  trigger: EventHookTrigger<T>
  clear: () => void
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

  const clear = () => {
    fns.clear()
  }

  const on = (fn: Callback<T>) => {
    fns.add(fn)
    const offFn = () => off(fn)

    tryOnScopeDispose(offFn)

    return {
      off: offFn,
    }
  }

  const trigger: EventHookTrigger<T> = (...args) => {
    return Promise.all(Array.from(fns).map(fn => fn(...(args as [T, ...unknown[]]))))
  }

  return {
    on,
    off,
    trigger,
    clear,
  }
}
