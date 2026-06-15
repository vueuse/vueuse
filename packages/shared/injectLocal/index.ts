import type { InjectionKey } from 'vue'
import { getCurrentInstance, getCurrentScope, hasInjectionContext, inject } from 'vue'
import { localProvidedStateMap } from '../provideLocal/map'

/**
 * On the basis of `inject`, it is allowed to directly call inject to obtain the value after call provide in the same component.
 *
 * @example
 * ```ts
 * injectLocal('MyInjectionKey', 1)
 * const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
// @ts-expect-error overloads are not compatible
export const injectLocal: typeof inject = <T>(...args) => {
  const key = args[0] as InjectionKey<T> | string | number
  const instance = getCurrentInstance()?.proxy
  const owner = instance ?? getCurrentScope()

  if (owner == null && !hasInjectionContext())
    throw new Error('injectLocal must be called in setup')

  if (owner && localProvidedStateMap.has(owner) && key in localProvidedStateMap.get(owner)!)
    return localProvidedStateMap.get(owner)![key]

  // @ts-expect-error overloads are not compatible
  return inject(...args)
}
