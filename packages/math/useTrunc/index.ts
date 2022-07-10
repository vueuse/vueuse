import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively Math.trunc(value).
 *
 * @see https://vueuse.org/useTrunc
 * @param value
 */
export function useTrunk(value: MaybeComputedRef<number>): ComputedRef<number> {
  return computed<number>(() => {
    if (resolveUnref(value) > 0)
      return Math.floor(resolveUnref(value))
    else
      return Math.ceil(resolveUnref(value))
  })
}
