import { type InjectionKey, getCurrentInstance, inject, provide } from 'vue-demi'

const localProvidedStateMap = new WeakMap<NonNullable<ReturnType<typeof getCurrentInstance>>, Record<string | symbol, any>>()

/**
 * On the basis of `provide`, it is allowed to directly call inject to obtain the value after call provide in the same component.
 *
 * @example
 * ```ts
 * provideEnhancedAllowanceOfCallsFromTheSameComponent('MyInjectionKey', 1)
 * const injectedValue = injectEnhancedAllowanceOfCallsFromTheSameComponent('MyInjectionKey') // injectedValue === 1
 * ```
 */
export const provideEnhancedAllowanceOfCallsFromTheSameComponent: typeof provide = (key, value) => {
  const instance = getCurrentInstance()
  if (instance == null)
    throw new Error('provideEnhancedAllowanceOfCallsFromTheSameComponent must be called in setup')

  if (!localProvidedStateMap.has(instance))
    localProvidedStateMap.set(instance, Object.create(null))

  const localProvidedState = localProvidedStateMap.get(instance)!
  // @ts-expect-error allow InjectionKey as key
  localProvidedState[key] = value
  provide(key, value)
}

/**
 * On the basis of `inject`, it is allowed to directly call inject to obtain the value after call provide in the same component.
 *
 * @example
 * ```ts
 * provideEnhancedAllowanceOfCallsFromTheSameComponent('MyInjectionKey', 1)
 * const injectedValue = injectEnhancedAllowanceOfCallsFromTheSameComponent('MyInjectionKey') // injectedValue === 1
 * ```
 */
// @ts-expect-error overloads are not compatible
export const injectEnhancedAllowanceOfCallsFromTheSameComponent: typeof inject = (...args) => {
  const key = args[0] as string | symbol
  const instance = getCurrentInstance()
  if (instance == null)
    throw new Error('injectEnhancedAllowanceOfCallsFromTheSameComponent must be called in setup')

  if (localProvidedStateMap.has(instance) && key in localProvidedStateMap.get(instance)!)
    return localProvidedStateMap.get(instance)![key]

  // @ts-expect-error overloads are not compatible
  return inject(...args)
}

/**
 * Create global state that can be injected into components.
 *
 * @see https://vueuse.org/createInjectionState
 *
 */
export function createInjectionState<Arguments extends Array<any>, Return>(
  composable: (...args: Arguments) => Return,
): readonly [useProvidingState: (...args: Arguments) => Return, useInjectedState: () => Return | undefined] {
  const key: string | InjectionKey<Return> = Symbol('InjectionState')
  const useProvidingState = (...args: Arguments) => {
    const state = composable(...args)
    provideEnhancedAllowanceOfCallsFromTheSameComponent(key, state)
    return state
  }
  const useInjectedState = () => injectEnhancedAllowanceOfCallsFromTheSameComponent(key)
  return [useProvidingState, useInjectedState]
}
