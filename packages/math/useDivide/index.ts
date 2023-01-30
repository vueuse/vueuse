import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively calculates the value of dividing two numbers
 *
 * @see https://vueuse.org/useDivide
 */
export function useDivide(divide: MaybeComputedRef<number>, divisor: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => resolveUnref(divide) / resolveUnref(divisor))
}
