import { computed, ComputedRef, unref } from 'vue-demi'
import { MaybeRef } from '../utils'

/**
 * `AND` conditions for refs.
 *
 * @see https://vueuse.org/and
 */
export function and(...args: MaybeRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.every(i => unref(i)))
}
