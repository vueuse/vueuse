import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * `AND` conditions for refs.
 *
 * @see https://vueuse.org/logicAnd
 */
export function logicAnd(...args: MaybeRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.every(i => unref(i)))
}

// alias
export { logicAnd as and }
