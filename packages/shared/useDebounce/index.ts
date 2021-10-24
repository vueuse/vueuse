import { ref, Ref, watch } from 'vue-demi'
import { useDebounceFn } from '../useDebounceFn'
import { DebounceFilterOptions } from '../utils'

export function useDebounce<T>(value: Ref<T>, ms = 200, opts: DebounceFilterOptions = { maxMs: null }): Readonly<Ref<T>> {
  if (ms <= 0)
    return value

  const debounced = ref(value.value as T) as Ref<T>

  const updater = useDebounceFn(() => {
    debounced.value = value.value
  }, ms, opts)

  watch(value, () => updater())

  return debounced
}
