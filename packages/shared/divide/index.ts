import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * `Divide` operation for refs.
 *
 * @see https://vueuse.org/divide
 */
export function divide(...args: MaybeRef<any>[]): ComputedRef<number> {
  return computed(() => args.reduce((prev, curr) => unref(prev) / unref(curr)))
}
