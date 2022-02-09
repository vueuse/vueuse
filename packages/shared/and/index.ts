import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * `AND` conditions for refs.
 *
 * @see https://vueuse.org/and
 */
export function and(...args: MaybeRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.every(i => unref(i)))
}
