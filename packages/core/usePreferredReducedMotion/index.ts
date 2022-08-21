import { computed } from 'vue-demi'
import { useMediaQuery } from '../useMediaQuery'
import type { ConfigurableWindow } from '../_configurable'

export type ReducedMotionType = 'reduce' | 'no-preference'

/**
 * Reactive prefers-reduced-motion media query.
 *
 * @see https://vueuse.org/usePreferredReducedMotion
 * @param [options]
 */
export function usePreferredReducedMotion(options?: ConfigurableWindow) {
  const isReduced = useMediaQuery('(prefers-reduced-motion: reduce)', options)

  return computed<ReducedMotionType>(() => {
    if (isReduced.value)
      return 'reduce'
    return 'no-preference'
  })
}
