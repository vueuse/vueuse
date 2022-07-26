import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

/**
 * Reactive `Array.findIndex`
 *
 * @see https://vueuse.org/useArrayFindIndex
 * @param {Array} list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns {number} the index of the first element in the array that passes the test. Otherwise, "-1".
 */
export function useArrayFindIndex<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: MaybeComputedRef<T>[]) => unknown,
): ComputedRef<number> {
  return computed(() => resolveUnref(list).findIndex((element, index, array) => fn(resolveUnref(element), index, array)))
}
