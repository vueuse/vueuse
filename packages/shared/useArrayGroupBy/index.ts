import type { ComputedRef, MaybeRefOrGetter } from 'vue-demi'
import { computed, toValue } from 'vue-demi'

/**
 * Reactive `Object.groupBy`
 *
 * @see https://vueuse.org/useArrayGroupBy
 * @param list - the array was called upon.
 * @param keySelector - a "keySelector" function.
 *
 * @returns The returned object has separate properties for each group, containing arrays with the elements in the group.
 */
export function useArrayGroupBy<K extends PropertyKey, T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  keySelector: (item: T, index: number) => K,
): ComputedRef<Partial<Record<K, T[]>>> {
  return computed(() => toValue(list).reduce<Partial<Record<K, T[]>>>((prev, item, index) => {
    (prev[keySelector(toValue(item), index)] ??= []).push(toValue(item))
    return prev
  }, {}))
}
