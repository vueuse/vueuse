import { ref } from 'vue-demi'

/**
 * Basic counter with utility functions.
 *
 * @see   {@link https://vueuse.js.org/useCounter}
 * @param [initialValue=0]
 */
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const inc = (delta = 1) => (count.value += delta)
  const dec = (delta = 1) => (count.value -= delta)
  const get = () => count.value
  const set = (val: number) => (count.value = val)
  const reset = (val = initialValue) => {
    initialValue = val
    return set(val)
  }

  return { count, inc, dec, get, set, reset }
}
