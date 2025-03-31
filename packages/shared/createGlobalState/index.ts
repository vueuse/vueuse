import type { AnyFn } from '../utils'
import { effectScope, onScopeDispose } from 'vue'

/**
 * Keep states in the global scope to be reusable across Vue instances.
 *
 * @see https://vueuse.org/createGlobalState
 * @param stateFactory A factory function to create the state
 */
export function createGlobalState<Fn extends AnyFn>(
  stateFactory: Fn,
): Fn {
  let initialized = false
  let state: any
  let summary = 0
  let scope = effectScope(true)

  function dispose() {
    if (scope && --summary <= 0) {
      scope.stop()
      state = scope = null;
    }
  }

  return ((...args: any[]) => {
    summary++

    if (!initialized) {
      state = scope.run(() => stateFactory(...args))!
      initialized = true
    }
    onScopeDispose(() => {
      dispose()
    })
    return state
  }) as Fn
}
