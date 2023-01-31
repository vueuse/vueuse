import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

/**
 * Reactive `Array.includes`
 *
 * @see https://vueuse.org/useArrayIncludes
 * @param {Array} list - the array was called upon.
 * @param searchElement - the value to search for.
 *
 * @returns {boolean} true if the `searchElement` is found in the array. Otherwise, false.
 */
export function useArrayIncludes<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  searchElement: T,
): ComputedRef<boolean> {
  return computed(() => resolveUnref(list).includes(searchElement))
}
