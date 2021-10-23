import { ref, Ref, watch } from 'vue-demi'
import { useDebounceFn } from '../useDebounceFn'

export function useDebounce<T>(value: Ref<T>, ms = 200, maxMs: number | null = null): Readonly<Ref<T>> {
  if (ms <= 0)
    return value

  const debounced = ref(value.value as T) as Ref<T>

  const updater = useDebounceFn(() => {
    debounced.value = value.value
  }, ms, maxMs)

  watch(value, () => updater())

  return debounced
}
