import type { MaybeRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { isRef, shallowRef, toValue } from 'vue'
import { makeDestructurable } from '../makeDestructurable'

export type ToggleFn<T = boolean> = (value?: T) => T

export type UseToggleDestructurableReturn<T> = readonly [ShallowRef<T>, ToggleFn<T>] & {
  /** current state */
  state: ShallowRef<T>
  /** alias of state for backward naming familiarity */
  value: ShallowRef<T>
  /** toggle function */
  toggle: ToggleFn<T>
}

export type UseToggleReturn<T = boolean> = UseToggleDestructurableReturn<T> | ToggleFn<T>

export interface UseToggleOptions<Truthy, Falsy> {
  truthyValue?: MaybeRefOrGetter<Truthy>
  falsyValue?: MaybeRefOrGetter<Falsy>
}

export function useToggle<Truthy, Falsy, T = Truthy | Falsy>(initialValue: Ref<T>, options?: UseToggleOptions<Truthy, Falsy>): ToggleFn<T>
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(initialValue?: T, options?: UseToggleOptions<Truthy, Falsy>): UseToggleDestructurableReturn<T>

/**
 * A boolean ref with a toggler
 *
 * @see https://vueuse.org/useToggle
 * @param [initialValue]
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useToggle(
  initialValue: MaybeRef<boolean> = false,
  options: UseToggleOptions<true, false> = {},
): UseToggleReturn<boolean> {
  const {
    truthyValue = true,
    falsyValue = false,
  } = options

  const valueIsRef = isRef(initialValue)
  const _value = shallowRef(initialValue) as ShallowRef<boolean>

  function toggle(value?: boolean) {
    // has arguments
    if (arguments.length) {
      _value.value = value!
      return _value.value
    }
    else {
      const truthy = toValue(truthyValue)
      _value.value = _value.value === truthy
        ? toValue(falsyValue)
        : truthy
      return _value.value
    }
  }

  if (valueIsRef) {
    return toggle
  }
  else {
    return makeDestructurable(
      { state: _value, value: _value, toggle },
      [_value, toggle] as const,
    ) as UseToggleDestructurableReturn<boolean>
  }
}
