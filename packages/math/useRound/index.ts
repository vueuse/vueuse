import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Math.round`.
 *
 * @see https://vueuse.org/useRound
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useRound(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed<number>(() => Math.round(toValue(value)))
}
