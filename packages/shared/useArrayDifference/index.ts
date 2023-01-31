import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

function differenceBy<T>(
  array: T[],
  other: T[],
  fn: (value: T) => unknown,
) {
  return array.filter(c => !other.map(fn).includes(fn(c)))
}

/**
 * Reactive get array difference of two array
 * @see https://vueuse.org/useArrayDifference
 * @param {Array} list - the array was called upon.
 * @param {Array} values - the array was called upon.
 * @param {Function} [fn] - the iteratee invoked per element.
 * @returns {Array} - the difference of two array
 */
export function useArrayDifference<T>(list: MaybeComputedRef<T[]>, values: MaybeComputedRef<T[]>, fn?: (value: T) => unknown): ComputedRef<T[]> {
  if (fn)
    return computed(() => differenceBy(resolveUnref(list), resolveUnref(values), fn))
  return computed(() => resolveUnref(list).filter(x => !resolveUnref(values).includes(x)))
}
