import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * `ADD` operation for refs.
 *
 * @see https://vueuse.org/add
 */
export function add(...args: MaybeRef<any>[]): ComputedRef<number> {
  return computed(() => args.reduce((prev, curr) => unref(prev) + unref(curr)))
}
