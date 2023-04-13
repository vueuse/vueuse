import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { toValue } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * `AND` conditions for refs.
 *
 * @see https://vueuse.org/logicAnd
 */
export function logicAnd(...args: MaybeComputedRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.every(i => toValue(i)))
}

// alias
export { logicAnd as and }
