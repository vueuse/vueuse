import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useMounted } from '../useMounted'

export type UseSupportedReturn = ComputedRef<boolean>

/* @__NO_SIDE_EFFECTS__ */
export function useSupported(callback: () => unknown) {
  const isMounted = useMounted()

  return computed(() => {
    // to trigger the ref
    // eslint-disable-next-line ts/no-unused-expressions
    isMounted.value
    return Boolean(callback())
  })
}
