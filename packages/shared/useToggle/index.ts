import type { Ref } from 'vue-demi'
import { isRef, ref, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

export interface UseToggleOptions<Truly, Falsely> {
  trulyValue?: MaybeRef<Truly>
  falselyValue?: MaybeRef<Falsely>
}

export function useToggle<Truly, Falsely, T = Truly | Falsely>(initialValue: Ref<T>, options?: UseToggleOptions<Truly, Falsely>): (value?: T) => T
export function useToggle<Truly = true, Falsely = false, T = Truly | Falsely>(initialValue?: T, options?: UseToggleOptions<Truly, Falsely>): [Ref<T>, (value?: T) => T]

/**
 * A boolean ref with a toggler
 *
 * @see https://vueuse.org/useToggle
 * @param [initialValue=false]
 */
export function useToggle(initialValue: MaybeRef<boolean> = false, options: UseToggleOptions<true, false> = {}) {
  const {
    trulyValue = true,
    falselyValue = false,
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
      innerValue.value = innerValue.value === unref(trulyValue) ? unref(falselyValue) : unref(trulyValue)
      return innerValue.value
    }
  }

  if (valueIsRef)
    return toggle
  else
    return [innerValue, toggle] as const
}
