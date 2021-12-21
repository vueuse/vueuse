import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * `SUBTRACT` operation for refs.
 *
 * @see https://vueuse.org/subtract
 */
export function subtract(...args: MaybeRef<any>[]): ComputedRef<number> {
  return computed(() => args.reduce((prev, curr) => unref(prev) - unref(curr)))
}
