import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * `NOT` conditions for refs.
 *
 * @see https://vueuse.org/logicNot
 */
export function logicNot(v: MaybeRef<any>): ComputedRef<boolean> {
  return computed(() => !unref(v))
}

// alias
export { logicNot as not }
