import type { InjectionKey } from 'vue'
import { injectLocal } from '../injectLocal'
import { provideLocal } from '../provideLocal'

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
 */
export function createInjectionState<Arguments extends Array<any>, Return>(
  composable: (...args: Arguments) => Return,
  options?: CreateInjectionStateOptions<Return>,
): readonly [useProvidingState: (...args: Arguments) => Return, useInjectedState: () => Return | undefined] {
  const key: string | InjectionKey<Return> = options?.injectionKey || Symbol(composable.name || 'InjectionState')
  const defaultValue = options?.defaultValue
  const useProvidingState = (...args: Arguments) => {
    const state = composable(...args)
    provideLocal(key, state)
    return state
  }
  const useInjectedState = () => injectLocal(key, defaultValue)
  return [useProvidingState, useInjectedState]
}
