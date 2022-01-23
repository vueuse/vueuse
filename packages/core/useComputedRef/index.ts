import type { ComputedGetter, Ref, WatchOptions } from 'vue-demi'
import { computed, ref, watch } from 'vue-demi'

export function useComputedRef<T>(getter: ComputedGetter<T>, watchOptions?: WatchOptions): Ref<T> {
  const computedValue = computed(getter)

  const refValue = ref(computedValue.value) as Ref<T>
  watch(() => computedValue.value, (value) => {
    refValue.value = value
  }, watchOptions)

  return refValue
}
