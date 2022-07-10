import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively get minimum of values.
 *
 * @see https://vueuse.org/useMinimum
 * @param values
 */
export function useMinimum(...mins: MaybeComputedRef<number>[]) {
  return computed<number>(() =>
    Math.min(...mins.map(value => resolveUnref(value))),
  )
}

// alias
export { useMinimum as useMin }
