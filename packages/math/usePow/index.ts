import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

/**
 * Reactive `Math.pow`
 *
 * @see https://vueuse.org/usePow
 */
export function usePow(base: MaybeComputedRef<number>, exponent: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => resolveUnref(base) ** resolveUnref(exponent))
}
