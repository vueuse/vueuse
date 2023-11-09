import type { Ref } from 'vue-demi'
import { isRef, ref } from 'vue-demi'
import type { MaybeRef, MaybeRefOrGetter } from '../utils'
import { toValue } from '../toValue'

export interface UseToggleOptions<Truthy, Falsy> {
  truthyValue?: MaybeRefOrGetter<Truthy>
  falsyValue?: MaybeRefOrGetter<Falsy>
}

export function useToggle<Truthy, Falsy, T = Truthy | Falsy>(initialValue: Ref<T>, options?: UseToggleOptions<Truthy, Falsy>): (value?: T) => T
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(initialValue?: T, options?: UseToggleOptions<Truthy, Falsy>): [Ref<T>, (value?: T) => T]

/**
 * A boolean ref with a toggler
 *
 * @see https://vueuse.org/useToggle
 * @param [initialValue]
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
      const truthy = toValue(truthyValue)
      _value.value = _value.value === truthy
        ? toValue(falsyValue)
        : truthy
      return _value.value
    }
  }

  if (valueIsRef)
    return toggle
  else
    return [_value, toggle] as const
}
