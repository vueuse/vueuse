import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Reactive `Math.abs`.
 *
 * @see https://vueuse.org/useAbs
 */
export function useAbs(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed(() => Math.abs(toValue(value)))
}
