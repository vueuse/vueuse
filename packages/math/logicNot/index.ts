import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue'
import { toValue } from '@vueuse/shared'
import { computed } from 'vue'

/**
 * `NOT` conditions for refs.
 *
 * @see https://vueuse.org/logicNot
 */
export function logicNot(v: MaybeRefOrGetter<any>): ComputedRef<boolean> {
  return computed(() => !toValue(v))
}

// alias
export { logicNot as not }
