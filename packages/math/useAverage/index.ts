import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { MaybeComputedRefArgs } from '../utils'
import { computed } from 'vue'
import { toValueArgsFlat } from '../utils'

export function useAverage(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>
export function useAverage(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>

/**
 * Get the average of an array reactively
 *
 * @see https://vueuse.org/useAverage
 */
export function useAverage(...args: MaybeComputedRefArgs<number>): ComputedRef<number> {
  return computed(() => {
    const array = toValueArgsFlat(args)
    return array.reduce((sum, v) => sum += v, 0) / array.length
  })
}
