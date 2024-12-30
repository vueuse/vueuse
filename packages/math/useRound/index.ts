import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Math.round`.
 *
 * @see https://vueuse.org/useRound
 */
export function useRound(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed<number>(() => Math.round(toValue(value)))
}
