import type { Ref } from 'vue-demi'
import { isRef, ref } from 'vue-demi'
import { resolveUnref } from '../resolveUnref'
import type { MaybeComputedRef, MaybeRef } from '../utils'

export interface UseToggleOptions<Truthy, Falsy> {
  truthyValue?: MaybeComputedRef<Truthy>
  falsyValue?: MaybeComputedRef<Falsy>
}

export function useToggle<Truthy, Falsy, T = Truthy | Falsy>(initialValue: Ref<T>, options?: UseToggleOptions<Truthy, Falsy>): (value?: T) => T
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(initialValue?: T, options?: UseToggleOptions<Truthy, Falsy>): [Ref<T>, (value?: T) => T]

/**
 * A boolean ref with a toggler
 *
 * @see https://vueuse.org/useToggle
 * @param [initialValue=false]
 */
export function useToggle(
  initialValue: MaybeRef<boolean> = false,
  options: UseToggleOptions<true, false> = {},
) {
  const {
    truthyValue = true,
    falsyValue = false,
  } = options

  const valueIsRef = isRef(initialValue)
  const _value = ref(initialValue) as Ref<boolean>

  function toggle(value?: boolean) {
    // has arguments
    if (arguments.length) {
      _value.value = value!
      return _value.value
    }
    else {
      const truthy = resolveUnref(truthyValue)
      _value.value = _value.value === truthy
        ? resolveUnref(falsyValue)
        : truthy
      return _value.value
    }
  }

  if (valueIsRef)
    return toggle
  else
    return [_value, toggle] as const
}
