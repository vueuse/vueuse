import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively clamp a value between two other values.
 *
 * @see https://vueuse.org/useBetween
 * @param value number
 * @param min
 * @param max
 */
export function useBetween(value: MaybeComputedRef<number>, min: MaybeComputedRef<number>, max: MaybeComputedRef<number>) {
  return computed(() => {
    const _value = resolveUnref(value)
    return _value > resolveUnref(min) && _value < resolveUnref(max)
  })
}
