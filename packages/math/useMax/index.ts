import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { MaybeComputedRefArgs } from '../utils'
import { toValueArgsFlat } from '../utils'

export function useMax(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>
export function useMax(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>

/**
 * Reactively get maximum of values.
 *
 * @see https://vueuse.org/useMax
 */
export function useMax(...args: MaybeComputedRefArgs<number>) {
  return computed<number>(() => {
    const array = toValueArgsFlat(args)
    return Math.max(...array)
  })
}
