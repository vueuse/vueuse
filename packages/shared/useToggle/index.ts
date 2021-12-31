import type { Ref } from 'vue-demi'
import { isRef, ref } from 'vue-demi'

/**
 * A boolean ref with a toggler
 *
 * @see https://vueuse.org/useToggle
 * @param [initialValue=false]
 */
export function useToggle(value: Ref<boolean>): (value?: boolean) => boolean
export function useToggle(initialValue?: boolean): [Ref<boolean>, (value?: boolean) => boolean]

export function useToggle(initialValue: boolean | Ref<boolean> = false) {
  if (isRef(initialValue)) {
    return (value?: boolean) => {
      initialValue.value = typeof value === 'boolean'
        ? value
        : !initialValue.value
    }
  }
  else {
    const boolean = ref(initialValue)
    const toggle = (value?: boolean) => {
      boolean.value = typeof value === 'boolean'
        ? value
        : !boolean.value
    }

    return [boolean, toggle] as const
  }
}
