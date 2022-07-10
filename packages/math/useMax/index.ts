import type { Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import type { MaybeComputedRef, MaybeRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively access a value no greater than max.
 *
 * @see https://vueuse.org/useMax
 * @param value number
 * @param max
 */
export function useMax(value: MaybeRef<number>, max: MaybeComputedRef<number>): Ref<number> {
  const _value = ref(value)
  return computed<number>({
    get() {
      return _value.value = Math.min(_value.value, resolveUnref(max))
    },
    set(value) {
      _value.value = Math.min(value, resolveUnref(max))
    },
  })
}
