import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Math.floor`
 *
 * @see https://vueuse.org/useFloor
 */
export function useFloor(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed<number>(() => Math.floor(toValue(value)))
}
