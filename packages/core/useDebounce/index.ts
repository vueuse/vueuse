import { ref, Ref, watch } from 'vue-demi'
import { useDebounceFn } from '../useDebounceFn'

export function useDebounce<T>(value: Ref<T>, delay = 200): Ref<T> {
  if (delay <= 0)
    return value

  const debounced = ref(value.value as T) as Ref<T>

  const updater = useDebounceFn(() => {
    debounced.value = value.value
  }, delay)

  watch(value, () => updater())

  return debounced
}
