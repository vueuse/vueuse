import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { toValue } from '@vueuse/shared'
import { computed } from 'vue-demi'

/**
 * Reactive `Math.floor`
 *
 * @see https://vueuse.org/useFloor
 */
export function useFloor(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed<number>(() => Math.floor(toValue(value)))
}
