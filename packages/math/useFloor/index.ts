import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively Math.floor(value).
 *
 * @see https://vueuse.org/useFloor
 * @param base
 * @param exponent
 */
export function useFloor(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => Math.floor(resolveUnref(value)))
}
