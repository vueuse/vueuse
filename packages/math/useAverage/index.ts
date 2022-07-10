import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * Reactively average value of a list
 * @param arr list
 * @returns
 */
export function useAverage(arr: MaybeComputedRef<Array<MaybeComputedRef<number>>>): ComputedRef<number> {
  return computed(() => {
    const originalArr = resolveUnref(arr)
    return originalArr.reduce<number>((sum, v) => sum += resolveUnref(v), 0) / originalArr.length
  })
}
