import type { ComputedRef, Ref } from 'vue-demi'
import { computed, isReadonly, ref } from 'vue-demi'
import type { MaybeComputedRef, MaybeReadonlyRef, MaybeRef } from '@vueuse/shared'
import { clamp, isFunction, resolveUnref } from '@vueuse/shared'

export function useClamp(
  value: MaybeReadonlyRef<number>,
  min: MaybeComputedRef<number>,
  max: MaybeComputedRef<number>,
): ComputedRef<number>

export function useClamp(
  value: MaybeRef<number>,
  min: MaybeComputedRef<number>,
  max: MaybeComputedRef<number>,
): Ref<number>

/**
 * Reactively clamp a value between two other values.
 *
 * @see https://vueuse.org/useClamp
 * @param value number
 * @param min
 * @param max
 */
export function useClamp(value: MaybeComputedRef<number>, min: MaybeComputedRef<number>, max: MaybeComputedRef<number>) {
  if (isFunction(value) || isReadonly(value))
    return computed(() => clamp(resolveUnref(value), resolveUnref(min), resolveUnref(max)))

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
