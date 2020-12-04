import { ref } from 'vue-demi'

/**
 * A boolean switcher with utility functions.
 *
 * @see   {@link https://vueuse.js.org/useBoolean}
 * @param [initialValue=false]
 */
export function useBoolean(initialValue = false) {
  const value = ref(initialValue)

  const toggle = () => (value.value = !value.value)
  const get = () => value.value
  const set = (val: boolean) => (value.value = val)

  return {
    value,
    toggle,
    get,
    set,
  }
}
