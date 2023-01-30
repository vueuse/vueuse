import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively calculates the difference value two numbers
 *
 * @see https://vueuse.org/useSubtract
 */
export function useSubtract(a: MaybeComputedRef<number>, b: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => resolveUnref(a) - resolveUnref(b))
}
