import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * Numeric subtraction for refs.
 *
 * @see https://vueuse.org/numericSubtract
 */
export function numericSubtract(a: MaybeComputedRef<number>, b: MaybeComputedRef<number>): ComputedRef<number> {
  return computed(() => resolveUnref(a) - resolveUnref(b))
}

// alias
export { numericSubtract as sub }
export { numericSubtract as subtract }
