import type { Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import type { MaybeComputedRef, MaybeRef } from '@vueuse/shared'
import { clamp, resolveUnref } from '@vueuse/shared'

/**
 * Reactively clamp a value between two other values.
 *
 * @see https://vueuse.org/useClamp
 * @param value number
 * @param min
 * @param max
 */
export function useClamp(value: MaybeRef<number>, min: MaybeComputedRef<number>, max: MaybeComputedRef<number>): Ref<number> {
  const _value = ref(value)
  return computed<number>({
    get() {
      return _value.value = clamp(_value.value, resolveUnref(min), resolveUnref(max))
    },
    set(value) {
      _value.value = clamp(value, resolveUnref(min), resolveUnref(max))
    },
  })
}
