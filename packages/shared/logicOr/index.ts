import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * `OR` conditions for refs.
 *
 * @see https://vueuse.org/logicOr
 */
export function logicOr(...args: MaybeRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.some(i => unref(i)))
}

// alias
export { logicOr as or }
