import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Array.findIndex`
 *
 * @see https://vueuse.org/useArrayFindIndex
 * @param list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns the index of the first element in the array that passes the test. Otherwise, "-1".
 */
export function useArrayFindIndex<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => unknown,
): ComputedRef<number> {
  return computed(() => toValue(list).findIndex((element, index, array) => fn(toValue(element), index, array)))
}
