import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '../resolveUnref'
import type { MaybeComputedRef } from '../utils'

/**
 * `NOT` conditions for refs.
 *
 * @see https://vueuse.org/logicNot
 */
export function logicNot(v: MaybeComputedRef<any>): ComputedRef<boolean> {
  return computed(() => !resolveUnref(v))
}

// alias
export { logicNot as not }
