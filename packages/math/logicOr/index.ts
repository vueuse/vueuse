import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

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
