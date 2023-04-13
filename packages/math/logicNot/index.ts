import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { toValue } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * `NOT` conditions for refs.
 *
 * @see https://vueuse.org/logicNot
 */
export function logicNot(v: MaybeComputedRef<any>): ComputedRef<boolean> {
  return computed(() => !toValue(v))
}

// alias
export { logicNot as not }
