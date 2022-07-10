import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * Numeric division for refs.
 *
 * @see https://vueuse.org/numericSubtract
 */
export function numericDivide(a: MaybeComputedRef<number>, b: MaybeComputedRef<number>): ComputedRef<number> {
  return computed(() => resolveUnref(a) / resolveUnref(b))
}

// alias
export { numericDivide as div }
export { numericDivide as divide }
