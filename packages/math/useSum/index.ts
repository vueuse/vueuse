import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

export function useSum(array: MaybeComputedRef<MaybeComputedRef<number>[]>): ComputedRef<number>
export function useSum(...args: MaybeComputedRef<number>[]): ComputedRef<number>

/**
 * Get the sum of a set of numbers.
 *
 * @see https://vueuse.org/useSum
 */
export function useSum(...args: any[]): ComputedRef<number> {
  return computed(() => args
    .flatMap((i) => {
      const v = resolveUnref(i)
      if (Array.isArray(v))
        return v.map(i => resolveUnref(i))
      return [v]
    })
    .reduce<number>((sum, v) => sum += v, 0),
  )
}
