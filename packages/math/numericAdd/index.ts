import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * Numeric addition for refs.
 *
 * @see https://vueuse.org/numericAdd
 */
export function numericAdd(...args: MaybeComputedRef<number>[]): ComputedRef<number> {
  return computed(() => args.reduce<number>((a, b) => resolveUnref(a) + resolveUnref(b), 0))
}

// alias
export { numericAdd as add }
