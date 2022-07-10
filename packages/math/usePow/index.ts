import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively Math.pow(base,exponent).
 *
 * @see https://vueuse.org/usePow
 * @param base
 * @param exponent
 */
export function usePow(base: MaybeComputedRef<number>, exponent: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => resolveUnref(base) ** resolveUnref(exponent))
}
