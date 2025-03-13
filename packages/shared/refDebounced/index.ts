import type { MaybeRefOrGetter, Ref } from 'vue'
import type { DebounceFilterOptions } from '../utils'
import { ref as deepRef, watch } from 'vue'
import { useDebounceFn } from '../useDebounceFn'

/**
 * Debounce updates of a ref.
 *
 * @return A new debounced ref.
 */
export function refDebounced<T>(value: Ref<T>, ms: MaybeRefOrGetter<number> = 200, options: DebounceFilterOptions = {}): Readonly<Ref<T>> {
  const debounced = deepRef(value.value as T) as Ref<T>

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
