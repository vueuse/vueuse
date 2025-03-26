import type { ReadonlyRefOrGetter } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { clamp } from '@vueuse/shared'
import { computed, ref as deepRef, isReadonly, toValue } from 'vue'

export function useClamp(
  value: ReadonlyRefOrGetter<number>,
  min: MaybeRefOrGetter<number>,
  max: MaybeRefOrGetter<number>,
): ComputedRef<number>

export function useClamp(
  value: MaybeRefOrGetter<number>,
  min: MaybeRefOrGetter<number>,
  max: MaybeRefOrGetter<number>,
): Ref<number>

/**
 * Reactively clamp a value between two other values.
 *
 * @see https://vueuse.org/useClamp
 * @param value number
 * @param min
 * @param max
 */
export function useClamp(value: MaybeRefOrGetter<number>, min: MaybeRefOrGetter<number>, max: MaybeRefOrGetter<number>) {
  if (typeof value === 'function' || isReadonly(value))
    return computed(() => clamp(toValue(value), toValue(min), toValue(max)))

  const _value = deepRef(value)
  return computed<number>({
    get() {
      return _value.value = clamp(_value.value, toValue(min), toValue(max))
    },
    set(value) {
      _value.value = clamp(value, toValue(min), toValue(max))
    },
  })
}
