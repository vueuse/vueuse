import type { InjectionKey } from 'vue'
import { injectLocal } from '../injectLocal'
import { makeDestructurable } from '../makeDestructurable'
import { provideLocal } from '../provideLocal'

export type CreateInjectionStateTuple<Arguments extends Array<any>, Return> = Readonly<[
  /**
   * Call this function in a provider component to create and provide the state.
   *
   * @param args Arguments passed to the composable
   * @returns The state returned by the composable
   */
  useProvidingState: (...args: Arguments) => Return,
  /**
   * Call this function in a consumer component to inject the state.
   *
   * @returns The injected state, or `undefined` if not provided and no default value was set.
   */
  useInjectedState: () => Return | undefined,
]>

export interface CreateInjectionStateObject<Arguments extends Array<any>, Return> extends Record<string | number, unknown> {
  /** provider side function */
  useProvidingState: (...args: Arguments) => Return
  /** consumer side function */
  useInjectedState: () => Return | undefined
  /** alias: same as useProvidingState */
  provide: (...args: Arguments) => Return
  /** alias: same as useInjectedState */
  inject: () => Return | undefined
}

export type CreateInjectionStateReturn<Arguments extends Array<any>, Return>
  = CreateInjectionStateTuple<Arguments, Return> & CreateInjectionStateObject<Arguments, Return>

export interface CreateInjectionStateOptions<Return> {
  /**
   * Custom injectionKey for InjectionState
   */
  injectionKey?: string | InjectionKey<Return>
  /**
   * Default value for the InjectionState
   */
  defaultValue?: Return
}

/**
 * Create global state that can be injected into components.
 *
 * @see https://vueuse.org/createInjectionState
 *
 * Supports both array and object destructuring:
 * const [provide, inject] = createInjectionState(...)
 * const { provide, inject } = createInjectionState(...)
 * Aliases: useProvidingState -> provide, useInjectedState -> inject
 *
 * @__NO_SIDE_EFFECTS__
 */
export function createInjectionState<Arguments extends Array<any>, Return>(
  composable: (...args: Arguments) => Return,
  options?: CreateInjectionStateOptions<Return>,
): CreateInjectionStateReturn<Arguments, Return> {
  const key: string | InjectionKey<Return> = options?.injectionKey || Symbol(composable.name || 'InjectionState')
  const defaultValue = options?.defaultValue
  const useProvidingState = (...args: Arguments) => {
    const state = composable(...args)
    provideLocal(key, state)
    return state
  }
  const useInjectedState = () => injectLocal(key, defaultValue)
  const obj: CreateInjectionStateObject<Arguments, Return> = {
    useProvidingState,
    useInjectedState,
    provide: useProvidingState,
    inject: useInjectedState,
  }

  const destructurable = makeDestructurable<CreateInjectionStateObject<Arguments, Return>, CreateInjectionStateTuple<Arguments, Return>>(
    obj,
    [useProvidingState, useInjectedState] as CreateInjectionStateTuple<Arguments, Return>,
  ) as CreateInjectionStateReturn<Arguments, Return>

  return destructurable
}
