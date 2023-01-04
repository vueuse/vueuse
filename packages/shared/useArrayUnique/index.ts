import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

/**
 * reactive unique array
 * @see https://vueuse.org/useArrayUnique
 * @param {Array} list - the array was called upon.
 * @returns {Array} A computed ref that returns a unique array of items.
 */
export function useArrayUnique<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>): ComputedRef<T[]> {
  return computed<T[]>(() => [...new Set<T>(resolveUnref(list).map(element => resolveUnref(element)))])
}
