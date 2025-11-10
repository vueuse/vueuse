import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * `OR` conditions for refs.
 *
 * @see https://vueuse.org/logicOr
 *
 * @__NO_SIDE_EFFECTS__
 */
export function logicOr(...args: MaybeRefOrGetter<any>[]): ComputedRef<boolean> {
  return computed(() => args.some(i => toValue(i)))
}

/** @deprecated use `logicOr` instead */
export const or = logicOr
