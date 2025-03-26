import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Array.find`
 *
 * @see https://vueuse.org/useArrayFind
 * @param list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns the first element in the array that satisfies the provided testing function. Otherwise, undefined is returned.
 */
export function useArrayFind<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => boolean,
): ComputedRef<T | undefined> {
  return computed(() =>
    toValue<T | undefined>(
      toValue(list)
        .find((element, index, array) => fn(toValue(element), index, array)),
    ))
}
