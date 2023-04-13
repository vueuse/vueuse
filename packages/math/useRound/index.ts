import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'

/**
 * Reactive `Math.round`.
 *
 * @see https://vueuse.org/useRound
 */
export function useRound(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed<number>(() => Math.round(toValue(value)))
}
