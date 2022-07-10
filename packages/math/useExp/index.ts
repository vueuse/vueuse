import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively Math.exp(value).
 *
 * @see https://vueuse.org/useExp
 * @param value
 */
export function useExp(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => Math.exp(resolveUnref(value)))
}
