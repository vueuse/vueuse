import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively calculates the product of two numbers
 *
 * @see https://vueuse.org/useMultiply
 */
export function useMultiply(a: MaybeComputedRef<number>, b: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => resolveUnref(a) * resolveUnref(b))
}
