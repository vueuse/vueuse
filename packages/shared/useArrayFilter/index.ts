import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

/**
 * Reactive `Array.filter`
 *
 * @see https://vueuse.org/useArrayFilter
 * @param {Array} list - the array was called upon.
 * @param fn - a function that is called for every element of the given `list`. Each time `fn` executes, the returned value is added to the new array.
 *
 * @returns {Array} a shallow copy of a portion of the given array, filtered down to just the elements from the given array that pass the test implemented by the provided function. If no elements pass the test, an empty array will be returned.
 */
export function useArrayFilter<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: T[]) => boolean,
): ComputedRef<T[]> {
  return computed(() => resolveUnref(list).map(i => resolveUnref(i)).filter(fn))
}
