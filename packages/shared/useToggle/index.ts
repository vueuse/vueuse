import type { Ref } from 'vue-demi'
import { isRef, ref, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

export interface UseToggleOptions<Truthy, Falsy> {
  truthyValue?: MaybeRef<Truthy>
  falsyValue?: MaybeRef<Falsy>
}

export function useToggle<Truthy, Falsy, T = Truthy | Falsy>(initialValue: Ref<T>, options?: UseToggleOptions<Truthy, Falsy>): (value?: T) => T
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(initialValue?: T, options?: UseToggleOptions<Truthy, Falsy>): [Ref<T>, (value?: T) => T]

/**
 * A boolean ref with a toggler
 *
 * @see https://vueuse.org/useToggle
 * @param [initialValue=false]
 */
export function useToggle(initialValue: MaybeRef<boolean> = false, options: UseToggleOptions<true, false> = {}) {
  const {
    truthyValue = true,
    falsyValue = false,
  } = options

  const valueIsRef = isRef(initialValue)
  const innerValue = ref(initialValue) as Ref<boolean>

  function toggle(value?: boolean) {
    // has arguments
    if (arguments.length) {
      innerValue.value = value!
      return innerValue.value
    }
    else {
      innerValue.value = innerValue.value === unref(truthyValue) ? unref(falsyValue) : unref(truthyValue)
      return innerValue.value
    }
  }

  if (valueIsRef)
    return toggle
  else
    return [innerValue, toggle] as const
}
