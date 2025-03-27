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
  const scope = effectScope(true)

  function dispose() {
    if (scope && --summary <= 0) {
      scope.stop()
    }
  }

  return ((...args: any[]) => {
    if (!initialized) {
      summary++
      state = scope.run(() => stateFactory(...args))!
      initialized = true
    }
    onScopeDispose(() => {
      dispose()
    })
    return state
  }) as Fn
}
