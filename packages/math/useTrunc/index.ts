import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactive `Math.trunc`.
 *
 * @see https://vueuse.org/useTrunc
 */
export function useTrunc(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => Math.trunc(resolveUnref(value)))
}
