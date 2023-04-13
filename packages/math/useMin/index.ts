import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import type { MaybeComputedRefArgs } from '../utils'
import { toValueArgsFlat } from '../utils'

export function useMin(array: MaybeComputedRef<MaybeComputedRef<number>[]>): ComputedRef<number>
export function useMin(...args: MaybeComputedRef<number>[]): ComputedRef<number>

/**
 * Reactive `Math.min`.
 *
 * @see https://vueuse.org/useMin
 * @param values
 */
export function useMin(...args: MaybeComputedRefArgs<number>) {
  return computed<number>(() => {
    const array = toValueArgsFlat(args)
    return Math.min(...array)
  })
}
