import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * Numeric multiplication for refs.
 *
 * @see https://vueuse.org/numericMultiply
 */
export function numericMultiply(...args: MaybeComputedRef<number>[]): ComputedRef<number> {
  return computed(() => args.reduce<number>((a, b) => resolveUnref(a) * resolveUnref(b), 1))
}

// alias
export { numericMultiply as mul }
export { numericMultiply as multiply }
