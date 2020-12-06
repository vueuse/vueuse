import { ref } from 'vue-demi'

/**
 * A boolean ref with a toggler
 *
 * @see   {@link https://vueuse.js.org/useToggle}
 * @param [initialValue=false]
 */
export function useToggle(initialValue = false) {
  const boolean = ref(initialValue)
  const toggle = () => (boolean.value = !boolean.value)

  return [boolean, toggle] as const
}
