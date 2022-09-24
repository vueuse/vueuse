import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import type { MaybeComputedRefArgs } from '../utils'
import { resolveUnrefArgsFlat } from '../utils'

export function useMax(array: MaybeComputedRef<MaybeComputedRef<number>[]>): ComputedRef<number>
export function useMax(...args: MaybeComputedRef<number>[]): ComputedRef<number>

/**
 * Reactively get maximum of values.
 *
 * @see https://vueuse.org/useMax
 * @param values
 */
export function useMax(...args: MaybeComputedRefArgs<number>) {
  return computed<number>(() => {
    const array = resolveUnrefArgsFlat(args)
    return Math.max(...array)
  })
}
