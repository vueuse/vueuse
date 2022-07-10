import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * Get the average of an array reactively
 *
 * @see https://vueuse.org/useAverage
 */
export function useAverage(array: MaybeComputedRef<MaybeComputedRef<number>[]>): ComputedRef<number> {
  return computed(() => {
    const arr = resolveUnref(array)
    return arr.reduce<number>((sum, v) => sum += resolveUnref(v), 0) / arr.length
  })
}
