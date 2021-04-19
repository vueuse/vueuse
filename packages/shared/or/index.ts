import { MaybeRef } from '../utils'
import { computed, ComputedRef, unref } from 'vue-demi'

/**
 * `OR` conditions for refs.
 *
 * @link https://vueuse.org/or
 */
export function or(...args: MaybeRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.some(i => unref(i)))
}
