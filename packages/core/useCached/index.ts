import type { Ref, WatchOptions } from 'vue-demi'
import { ref, watch } from 'vue-demi'

export function useCached<T>(
  refValue: Ref<T>,
  comparator: (a: T, b: T) => boolean = (a, b) => a === b,
  watchOptions?: WatchOptions,
): Ref<T> {
  const cachedValue = ref(refValue.value) as Ref<T>

  watch(() => refValue.value, (value) => {
    if (!comparator(value, cachedValue.value))
      cachedValue.value = value
  }, watchOptions)

  return cachedValue
}
