import type { ComputedRef } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import { computed } from 'vue-demi'

/**
 * Reactive `Unique Arrays`
 *
 * @see https://vueuse.org/useUnique
 * @param {Array} list - the array was called upon.
 * @returns {Array} a uniqe copy if the given array
 */
export function useUnique<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
): ComputedRef<T[]> {
  return computed(() => resolveUnref([...new Set(resolveUnref(list))]).map(i => resolveUnref(i)))
}
