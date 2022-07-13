import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

export function useMin(array: MaybeComputedRef<MaybeComputedRef<number>[]>): ComputedRef<number>
export function useMin(...args: MaybeComputedRef<number>[]): ComputedRef<number>

/**
 * Get the minimum value of a set of numbers.
 *
 * @see https://vueuse.org/useMin
 * @param nums
 */
export function useMin(...args: any[]): ComputedRef<number> {
  return computed(() => Math.min(...args.flatMap((i) => {
    const v = resolveUnref(i)
    if (Array.isArray(v))
      return v.map(i => resolveUnref(i))
    return [v]
  })))
}
