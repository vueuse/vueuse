import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * `AND` conditions for refs.
 *
 * @see https://vueuse.org/logicAnd
 *
 * @__NO_SIDE_EFFECTS__
 */
export function logicAnd(...args: MaybeRefOrGetter<any>[]): ComputedRef<boolean> {
  return computed(() => args.every(i => toValue(i)))
}

/** @deprecated use `logicAnd` instead */
export const and = logicAnd
