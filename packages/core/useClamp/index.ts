import type { Ref } from 'vue-demi'
import { computed, ref, unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { clamp } from '@vueuse/shared'

/**
 * Reactively clamp a value between two other values.
 *
 * @see https://vueuse.org/useClamp
 * @param value number
 * @param min
 * @param max
 */
export function useClamp(value: MaybeRef<number>, min: MaybeRef<number>, max: MaybeRef<number>): Ref<number> {
  const _value = ref(value)
  return computed<number>({
    get() {
      return clamp(_value.value, unref(min), unref(max))
    },
    set(value) {
      _value.value = clamp(value, unref(min), unref(max))
    },
  })
}
