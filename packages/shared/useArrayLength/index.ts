import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

/**
 * Reactive `Array.length`
 *
 * @see https://vueuse.org/useArrayLength
 * @param {Array} list - the array was called upon.
 * @returns {number} the length of the array
 */
export function useArrayLength(list: MaybeComputedRef<MaybeComputedRef<any>[]>) {
  return computed(() => resolveUnref(list).length)
}
