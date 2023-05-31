import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

/**
 * Reactive `Math.abs`.
 *
 * @see https://vueuse.org/useAbs
 */
export function useAbs(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed(() => Math.abs(toValue(value)))
}
