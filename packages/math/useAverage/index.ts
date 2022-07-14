import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

export function useAverage(array: MaybeComputedRef<MaybeComputedRef<number>[]>): ComputedRef<number>
export function useAverage(...args: MaybeComputedRef<number>[]): ComputedRef<number>

/**
 * Get the average of an array reactively
 *
 * @see https://vueuse.org/useAverage
 */
export function useAverage(...args: any[]): ComputedRef<number> {
  return computed(() => {
    const array = args
      .flatMap<number>((i) => {
        const v = resolveUnref(i)
        if (Array.isArray(v))
          return v.map(i => resolveUnref(i))
        return [v]
      })
    return array.reduce<number>((sum, v) => sum += v, 0) / array.length
  })
}
