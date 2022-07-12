import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Get the sum of a set of numbers.
 *
 * @see https://vueuse.org/useSum
 */
export function useSum(array: MaybeComputedRef<Array<MaybeComputedRef<number>>>): ComputedRef<number> {
  return computed(() => resolveUnref(array).reduce<number>((sum, v) => sum += resolveUnref(v), 0))
}
