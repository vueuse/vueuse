import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively get maximum of values.
 *
 * @see https://vueuse.org/useMaximum
 * @param values
 */
export function useMaximum(...maximums: MaybeComputedRef<number>[]) {
  return computed<number>(() =>
    Math.max(...maximums.map(value => resolveUnref(value))),
  )
}

// alias
export { useMaximum as useMax }
