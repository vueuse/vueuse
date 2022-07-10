import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively returns the square root of a number.
 *
 * @see https://vueuse.org/useSqrt
 * @param value
 */
export function useSqrt(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => Math.sqrt(resolveUnref(value)))
}
