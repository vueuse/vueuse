import type { MaybeRefOrGetter, Ref } from 'vue'
import type { DebounceFilterOptions } from '../utils'
import { ref as deepRef, toValue, watch } from 'vue'
import { useDebounceFn } from '../useDebounceFn'

export type RefDebouncedReturn<T = any> = Readonly<Ref<T>>

/**
 * Debounce updates of a ref.
 *
 * @return A new debounced ref.
 */
export function refDebounced<T>(value: Ref<T>, ms: MaybeRefOrGetter<number> = 200, options: DebounceFilterOptions = {}): RefDebouncedReturn {
  const debounced = deepRef<T>(toValue(value))

  const updater = useDebounceFn(() => {
    debounced.value = value.value
  }, ms, options)

  watch(value, () => updater())

  return debounced
}

// alias
export {
  refDebounced as debouncedRef,
  refDebounced as useDebounce,
}
