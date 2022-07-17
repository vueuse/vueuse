import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import type { MaybeComputedRefArgs } from '../utils'
import { resolveUnrefArgsFlat } from '../utils'

export function useAverage(array: MaybeComputedRef<MaybeComputedRef<number>[]>): ComputedRef<number>
export function useAverage(...args: MaybeComputedRef<number>[]): ComputedRef<number>

/**
 * Get the average of an array reactively
 *
 * @see https://vueuse.org/useAverage
 */
export function useAverage(...args: MaybeComputedRefArgs<number>): ComputedRef<number> {
  return computed(() => {
    const array = resolveUnrefArgsFlat(args)
    return array.reduce((sum, v) => sum += v, 0) / array.length
  })
}
