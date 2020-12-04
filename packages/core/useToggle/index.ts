import { ref } from 'vue-demi'

/**
 * A boolean switcher with utility functions.
 *
 * @see   {@link https://vueuse.js.org/useToggle}
 * @param [initialValue=false]
 */
export function useToggle(initialValue = false) {
  const value = ref(initialValue)
  const toggle = () => (value.value = !value.value)

  return [value, toggle]
}
