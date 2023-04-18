import type { EffectScope } from 'vue-demi'
import { effectScope } from 'vue-demi'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import type { AnyFn } from '../utils'

/**
 * Make a composable function usable with multiple Vue instances.
 *
 * @see https://vueuse.org/createSharedComposable
 */
export function createSharedComposable<Fn extends AnyFn>(composable: Fn): Fn {
  let subscribers = 0
  let state: ReturnType<Fn> | undefined
  let scope: EffectScope | undefined

  const dispose = () => {
    subscribers -= 1
    if (scope && subscribers <= 0) {
      scope.stop()
      state = undefined
      scope = undefined
    }
  }

  return <Fn>((...args) => {
    subscribers += 1
    if (!state) {
      scope = effectScope(true)
      state = scope.run(() => composable(...args))
    }
    tryOnScopeDispose(dispose)
    return state
  })
}
