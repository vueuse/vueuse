import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Get the minimum value of a set of numbers.
 *
 * @see https://vueuse.org/useMin
 * @param nums
 */
export function useMin(nums: MaybeComputedRef<Array<MaybeComputedRef<number>>>): ComputedRef<number> {
  return computed(
    () => Math.min(...resolveUnref(nums).map(resolveUnref)),
  )
}
