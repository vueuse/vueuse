import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactive `Math.ceil`.
 *
 * @see https://vueuse.org/useCeil
 */
export function useCeil(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => Math.ceil(resolveUnref(value)))
}
