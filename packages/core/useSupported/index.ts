import { computed } from 'vue-demi'
import { useMounted } from '../useMounted'

export function useSupported(callback: () => unknown) {
  const isMounted = useMounted()

  return computed(() => {
    /**
     * Although we're sure isMounted.value will never be undefined,
     * we want to track changes to it regardless its value (for SSR compat),
     * so it must be in the body of computed's callback.
     */
    return isMounted.value !== undefined ? Boolean(callback()) : false
  })
}
