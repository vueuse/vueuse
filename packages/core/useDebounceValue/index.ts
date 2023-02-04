import type { Ref } from 'vue-demi'
import { ref, watch } from 'vue-demi'

export function useDebounceValue(value: Ref<string>, delay = 200) {
  const debouncedValue = ref(value.value)
  let timeout: NodeJS.Timeout

  watch(value, (nv: string) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = nv
    }, delay)
  })

  return debouncedValue
}
