import { effectScope } from 'vue-demi'

export type CreateGlobalStateReturn<T> = () => T

/**
 * Keep states in the global scope to be reusable across Vue instances.
 *
 * @see https://vueuse.org/createGlobalState
 * @param stateFactory A factory function to create the state
 */
export function createGlobalState<T>(
  stateFactory: () => T,
): CreateGlobalStateReturn<T> {
  let initialized = false
  let state: T
  const scope = effectScope(true)

  return () => {
    if (!initialized) {
      state = scope.run(stateFactory)!
      initialized = true
    }
    return state
  }
}
