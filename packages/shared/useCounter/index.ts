import type { MaybeRef, Ref } from 'vue'
import {
  shallowReadonly,
  shallowRef,
  // eslint-disable-next-line no-restricted-imports
  unref,
} from 'vue'

export interface UseCounterOptions {
  min?: number
  max?: number
}

export interface UseCounterReturn {
  /**
   * The current value of the counter.
   */
  readonly count: Readonly<Ref<number>>
  /**
   * Increment the counter.
   *
   * @param {number} [delta=1] The number to increment.
   */
  inc: (delta?: number) => void
  /**
   * Decrement the counter.
   *
   * @param {number} [delta=1] The number to decrement.
   */
  dec: (delta?: number) => void
  /**
   * Get the current value of the counter.
   */
  get: () => number
  /**
   * Set the counter to a new value.
   *
   * @param val The new value of the counter.
   */
  set: (val: number) => void
  /**
   * Reset the counter to an initial value.
   */
  reset: (val?: number) => number
}

/**
 * Basic counter with utility functions.
 *
 * @see https://vueuse.org/useCounter
 * @param [initialValue]
 * @param options
 */
export function useCounter(initialValue: MaybeRef<number> = 0, options: UseCounterOptions = {}) {
  let _initialValue = unref(initialValue)
  const count = shallowRef(initialValue)

  const {
    max = Number.POSITIVE_INFINITY,
    min = Number.NEGATIVE_INFINITY,
  } = options

  const inc = (delta = 1) => count.value = Math.max(Math.min(max, count.value + delta), min)
  const dec = (delta = 1) => count.value = Math.min(Math.max(min, count.value - delta), max)
  const get = () => count.value
  const set = (val: number) => (count.value = Math.max(min, Math.min(max, val)))
  const reset = (val = _initialValue) => {
    _initialValue = val
    return set(val)
  }

  return { count: shallowReadonly(count), inc, dec, get, set, reset }
}
