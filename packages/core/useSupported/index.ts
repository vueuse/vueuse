import { computed } from 'vue-demi'
import { useMounted } from '../useMounted'

export function useSupported(callback: () => unknown) {
  const isMounted = useMounted()
  const callbackResult = computed(callback)

  return computed(() => isMounted.value && callbackResult.value)
}
