import { computed } from 'vue-demi'
import { useMounted } from '../useMounted'

export function useSupported(callback: () => unknown) {
  const isMounted = useMounted()
  return computed(() => isMounted.value && Boolean(callback()))
}
