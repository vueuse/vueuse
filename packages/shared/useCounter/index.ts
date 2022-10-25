import { ref } from 'vue-demi'

export interface UseCounterOptions {
  min?: number
  max?: number
}

/**
 * Basic counter with utility functions.
 *
 * @see https://vueuse.org/useCounter
 * @param [initialValue=0]
 * @param {Object} options
 */
export function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const count = ref(initialValue)

  const {
    max = Infinity,
    min = -Infinity,
  } = options

  const inc = (delta = 1) => count.value = Math.min(max, count.value + delta)
  const dec = (delta = 1) => count.value = Math.max(min, count.value - delta)
  const get = () => count.value
  const set = (val: number) => (count.value = Math.max(min, Math.min(max, val)))
  const reset = (val = initialValue) => {
    initialValue = val
    return set(val)
  }

  return { count, inc, dec, get, set, reset }
}
