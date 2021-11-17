import { ref } from 'vue-demi'

interface useCounterOptions {
  minValue?: number
  maxValue?: number
}

/**
 * Basic counter with utility functions.
 *
 * @see https://vueuse.org/useCounter
 * @param [initialValue=0]
 * @param {Object} options
 */
export function useCounter(initialValue = 0, options: useCounterOptions = { minValue: undefined, maxValue: undefined }) {
  const count = ref(initialValue)

  const inc = (delta = 1) => {
    if (!options.maxValue) {
      count.value += delta
      return
    }
    if ((options.maxValue && count.value < options.maxValue)) {
      count.value = count.value + delta > options.maxValue ? options.maxValue : count.value + delta
    }
  }
  const dec = (delta = 1) => {
    if (!options.maxValue) {
      count.value -= delta
      return
    }
    if ((options.minValue && count.value > options.minValue)) {
      count.value = count.value - delta < options.minValue ? options.minValue : count.value - delta
    }
  }
  const get = () => count.value
  const set = (val: number) => (count.value = val)
  const reset = (val = initialValue) => {
    initialValue = val
    return set(val)
  }

  return { count, inc, dec, get, set, reset }
}
