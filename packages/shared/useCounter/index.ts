import { ref } from 'vue-demi'

interface useCounterOptions {
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
export function useCounter(initialValue = 0, options: useCounterOptions = { min: undefined, max: undefined }) {
  const count = ref(initialValue)

  const inc = (delta = 1) => {
    if (!options.max) {
      count.value += delta
      return
    }
    if (options.max && count.value < options.max)
      count.value = count.value + delta > options.max ? options.max : count.value + delta
  }
  const dec = (delta = 1) => {
    if (!options.min) {
      count.value -= delta
      return
    }
    if (options.min && count.value > options.min)
      count.value = count.value - delta < options.min ? options.min : count.value - delta
  }
  const get = () => count.value
  const set = (val: number) => (count.value = val)
  const reset = (val = initialValue) => {
    initialValue = val
    return set(val)
  }

  return { count, inc, dec, get, set, reset }
}
