import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Math.trunc`.
 *
 * @see https://vueuse.org/useTrunc
 */
export function useTrunc(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed<number>(() => Math.trunc(toValue(value)))
}
