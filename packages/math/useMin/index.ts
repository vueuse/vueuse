import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { MaybeComputedRefArgs } from '../utils'
import { computed } from 'vue'
import { toValueArgsFlat } from '../utils'

export function useMin(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>
export function useMin(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>

/**
 * Reactive `Math.min`.
 *
 * @see https://vueuse.org/useMin
 */
export function useMin(...args: MaybeComputedRefArgs<number>) {
  return computed<number>(() => {
    const array = toValueArgsFlat(args)
    return Math.min(...array)
  })
}
