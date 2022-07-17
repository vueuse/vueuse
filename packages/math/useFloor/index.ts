import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactive `Math.floor`
 *
 * @see https://vueuse.org/useFloor
 */
export function useFloor(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => Math.floor(resolveUnref(value)))
}
