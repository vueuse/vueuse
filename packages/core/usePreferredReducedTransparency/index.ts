import { computed } from 'vue-demi'
import { useMediaQuery } from '../useMediaQuery'
import type { ConfigurableWindow } from '../_configurable'

export type ReducedTransparencyType = 'reduce' | 'no-preference'

/**
 * Reactive prefers-reduced-transparency media query.
 *
 * @see https://vueuse.org/usePreferredReducedTransparency
 * @param [options]
 */
export function usePreferredReducedTransparency(options?: ConfigurableWindow) {
  const isReduced = useMediaQuery('(prefers-reduced-transparency: reduce)', options)

  return computed<ReducedTransparencyType>(() => {
    if (isReduced.value)
      return 'reduce'
    return 'no-preference'
  })
}
