import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { MaybeComputedRefArgs } from '../utils'
import { computed } from 'vue'
import { toValueArgsFlat } from '../utils'

export function useSum(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>
export function useSum(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>

/**
 * Get the sum of a set of numbers.
 *
 * @see https://vueuse.org/useSum
 */
export function useSum(...args: MaybeComputedRefArgs<number>): ComputedRef<number> {
  return computed(() => toValueArgsFlat(args).reduce((sum, v) => sum += v, 0))
}
