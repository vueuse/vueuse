import type { Ref } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import { useDebounceFn } from '../useDebounceFn'
import type { DebounceFilterOptions } from '../utils'

/**
 * Debounce updates of a ref.
 *
 * @return A new debounced ref.
 */
export function refDebounced<T>(value: Ref<T>, ms = 200, options: DebounceFilterOptions = {}): Readonly<Ref<T>> {
  if (ms <= 0)
    return value

  const debounced = ref(value.value as T) as Ref<T>

  const updater = useDebounceFn(() => {
    debounced.value = value.value
  }, ms, options)

  watch(value, () => updater())

  return debounced
}

// alias
export {
  refDebounced as useDebounce,
  refDebounced as debouncedRef,
}
