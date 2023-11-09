import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeRefOrGetter } from '../utils'
import { toValue } from '../toValue'

/**
 * Reactive `Array.some`
 *
 * @see https://vueuse.org/useArraySome
 * @param list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns **true** if the `fn` function returns a **truthy** value for any element from the array. Otherwise, **false**.
 */
export function useArraySome<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => unknown,
): ComputedRef<boolean> {
  return computed(() => toValue(list).some((element, index, array) => fn(toValue(element), index, array)))
}
