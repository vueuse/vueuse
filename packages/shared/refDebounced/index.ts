import type { Ref } from 'vue'
import type { DebounceFilterOptions, MaybeRefOrGetter } from '../utils'
import { ref, watch } from 'vue'
import { useDebounceFn } from '../useDebounceFn'

/**
 * Debounce updates of a ref.
 *
 * @return A new debounced ref.
 */
export function refDebounced<T>(value: Ref<T>, ms: MaybeRefOrGetter<number> = 200, options: DebounceFilterOptions = {}): Readonly<Ref<T>> {
  const debounced = ref(value.value as T) as Ref<T>

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
