import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { toValue } from '../toValue'
import type { MaybeRefOrGetter } from '../utils'

/**
 * Reactively convert a ref to string.
 *
 * @see https://vueuse.org/useToString
 */
export function useToString(
  value: MaybeRefOrGetter<unknown>,
): ComputedRef<string> {
  return computed(() => `${toValue(value)}`)
}
