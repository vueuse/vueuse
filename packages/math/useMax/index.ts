import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively get maximum of values.
 *
 * @see https://vueuse.org/useMax
 * @param values
 */
export function useMax(...values: MaybeComputedRef<number>[]) {
  return computed<number>(() =>
    Math.max(...values.map(value => resolveUnref(value))),
  )
}
