import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Array.join`
 *
 * @see https://vueuse.org/useArrayJoin
 * @param list - the array was called upon.
 * @param separator - a string to separate each pair of adjacent elements of the array. If omitted, the array elements are separated with a comma (",").
 *
 * @returns a string with all array elements joined. If arr.length is 0, the empty string is returned.
 */
export function useArrayJoin(
  list: MaybeRefOrGetter<MaybeRefOrGetter<any>[]>,
  separator?: MaybeRefOrGetter<string>,
): ComputedRef<string> {
  return computed(() => toValue(list).map(i => toValue(i)).join(toValue(separator)))
}
