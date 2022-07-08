import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '../resolveUnref'
import type { MaybeComputedRef } from '../utils'

/**
 * `AND` conditions for refs.
 *
 * @see https://vueuse.org/logicAnd
 */
export function logicAnd(...args: MaybeComputedRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.every(i => resolveUnref(i)))
}

// alias
export { logicAnd as and }
