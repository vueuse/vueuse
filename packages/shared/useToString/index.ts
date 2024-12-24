import type { ComputedRef } from 'vue'
import type { MaybeRefOrGetter } from '../utils'
import { computed, toValue } from 'vue'

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
