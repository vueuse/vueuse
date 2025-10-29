import type { InjectionKey } from 'vue'
import type { LocalProvidedKey } from './map'
import { getCurrentInstance, getCurrentScope, provide } from 'vue'
import { localProvidedStateMap } from './map'

export type ProvideLocalReturn = void

/**
 * On the basis of `provide`, it is allowed to directly call inject to obtain the value after call provide in the same component.
 *
 * @example
 * ```ts
 * provideLocal('MyInjectionKey', 1)
 * const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
 * ```
 */
export function provideLocal<T, K = LocalProvidedKey<T>>(key: K, value: K extends InjectionKey<infer V> ? V : T): ProvideLocalReturn {
  const instance = getCurrentInstance()?.proxy
  const owner = instance ?? getCurrentScope()

  if (owner == null)
    throw new Error('provideLocal must be called in setup')

  if (!localProvidedStateMap.has(owner))
    localProvidedStateMap.set(owner, Object.create(null))

  const localProvidedState = localProvidedStateMap.get(owner)!
  // @ts-expect-error allow InjectionKey as key
  localProvidedState[key] = value
  return provide<T, K>(key, value)
}
