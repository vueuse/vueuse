import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Get the sum of a set of numbers.
 *
 * @see https://vueuse.org/useSum
 * @param nums
 */
export function useSum(nums: MaybeComputedRef<Array<MaybeComputedRef<number>>>): ComputedRef<number> {
  return computed(
    () => resolveUnref(nums).reduce(
      (prev: number, curr: MaybeComputedRef<number>) => prev + resolveUnref(curr), 0,
    ),
  )
}
