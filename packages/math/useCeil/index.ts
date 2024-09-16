import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { toValue } from '@vueuse/shared'
import { computed } from 'vue-demi'

/**
 * Reactive `Math.ceil`.
 *
 * @see https://vueuse.org/useCeil
 */
export function useCeil(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed<number>(() => Math.ceil(toValue(value)))
}
