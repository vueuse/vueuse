import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

/**
 * Reactive `Array.join`
 *
 * @see https://vueuse.org/useArrayJoin
 * @param {Array} list - the array was called upon.
 * @param {string} separator - a string to separate each pair of adjacent elements of the array. If omitted, the array elements are separated with a comma (",").
 *
 * @returns {string} a string with all array elements joined. If arr.length is 0, the empty string is returned.
 */
export function useArrayJoin(
  list: MaybeComputedRef<MaybeComputedRef<any>[]>,
  separator?: MaybeComputedRef<string>,
): ComputedRef<string> {
  return computed(() => resolveUnref(list).map(i => resolveUnref(i)).join(resolveUnref(separator)))
}
