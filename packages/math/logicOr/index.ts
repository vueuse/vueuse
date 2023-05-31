import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'

/**
 * `OR` conditions for refs.
 *
 * @see https://vueuse.org/logicOr
 */
export function logicOr(...args: MaybeRefOrGetter<any>[]): ComputedRef<boolean> {
  return computed(() => args.some(i => toValue(i)))
}

// alias
export { logicOr as or }
