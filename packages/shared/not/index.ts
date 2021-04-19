import { MaybeRef } from '../utils'
import { computed, ComputedRef, unref } from 'vue-demi'

/**
 * `NOT` conditions for refs.
 *
 * @link https://vueuse.org/not
 */
export function not(v: MaybeRef<any>): ComputedRef<boolean> {
  return computed(() => !unref(v))
}
