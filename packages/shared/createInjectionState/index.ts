import type { InjectionKey } from 'vue-demi'
import { provideLocal } from '../provideLocal'
import { injectLocal } from '../injectLocal'

export interface CreateInjectionStateOptions<Return> {
  /**
   * Custom injectionKey for InjectionState
   */
  injectionKey?: string | InjectionKey<Return>
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
  const key: string | InjectionKey<Return> = options?.injectionKey || Symbol('InjectionState')
  const useProvidingState = (...args: Arguments) => {
    const state = composable(...args)
    provideLocal(key, state)
    return state
  }
  const useInjectedState = () => injectLocal(key)
  return [useProvidingState, useInjectedState]
}
