import type { Ref } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively clamp a value between two other values.
 *
 * @see https://vueuse.org/useFixed
 * @param value number
 * @param digits The number of digits to appear after the decimal point
 * @param max
 */
export function useFixed(value: MaybeComputedRef<number>, digits: MaybeComputedRef<number> = 0): Ref<number> {
  return computed(() => +(resolveUnref(value)).toFixed(resolveUnref(digits)))
}
