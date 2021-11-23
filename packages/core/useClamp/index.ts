import { ref, computed, unref } from 'vue-demi'
import { MaybeRef } from '..'

/**
 * Reactive Clamp a value between two other values.
 *
 * @see https://vueuse.org/useClamp
 * @param initialValue number
 * @param min
 * @param max
 */
export function useClamp(initialValue: number, min: MaybeRef<number>, max: MaybeRef<number>) {
  const _value = ref(initialValue)
  const result = computed({
    get() {
      return clamp(_value.value, unref(min), unref(max))
    },
    set(value: number) {
      _value.value = clamp(value, unref(min), unref(max))
    },
  })
  return result
}

function clamp(value: number, min: number, max: number) {
  return min < max
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value)
}
