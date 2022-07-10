import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively Math.ceil(value).
 *
 * @see https://vueuse.org/useCeil
 * @param base
 * @param exponent
 */
export function useCeil(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => Math.ceil(resolveUnref(value)))
}
