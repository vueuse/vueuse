import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Array.map`
 *
 * @see https://vueuse.org/useArrayMap
 * @param list - the array was called upon.
 * @param fn - a function that is called for every element of the given `list`. Each time `fn` executes, the returned value is added to the new array.
 *
 * @returns a new array with each element being the result of the callback function.
 */
export function useArrayMap<T, U = T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T, index: number, array: T[]) => U,
): ComputedRef<U[]> {
  return computed(() => toValue(list).map(i => toValue(i)).map(fn))
}
