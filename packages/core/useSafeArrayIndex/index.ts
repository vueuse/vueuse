import { useClamp } from '@vueuse/math'
import type { MaybeComputedRef, MaybeRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Make sure the index does not exceed the range of the array.
 *
 * @param arr
 * @param initinal
 */
export function useSafeArrayIndex<T>(arr: MaybeComputedRef<ArrayLike<T>>, initinal: MaybeRef<number> = 0) {
  return useClamp(initinal, 0, () => Math.max(0, resolveUnref(arr).length - 1))
}

