import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactive `Math.round`.
 *
 * @see https://vueuse.org/useRound
 */
export function useRound(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => Math.round(resolveUnref(value)))
}
