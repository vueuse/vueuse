import { isRef, Ref, ref } from 'vue-demi'
import { Fn } from '../utils'

/**
 * A boolean ref with a toggler
 *
 * @see   {@link https://vueuse.js.org/useToggle}
 * @param [initialValue=false]
 */
export function useToggle(value: Ref<boolean>): Fn
export function useToggle(initialValue?: boolean): [Ref<boolean>, Fn]

export function useToggle(initialValue: boolean | Ref<boolean> = false): any {
  if (isRef(initialValue)) {
    return () => (initialValue.value = !initialValue.value)
  }
  else {
    const boolean = ref(initialValue)
    const toggle = () => (boolean.value = !boolean.value)

    return [boolean, toggle] as const
  }
}
