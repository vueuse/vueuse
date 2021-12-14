import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * `OR` conditions for refs.
 *
 * @see https://vueuse.org/or
 */
export function or(...args: MaybeRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.some(i => unref(i)))
}
