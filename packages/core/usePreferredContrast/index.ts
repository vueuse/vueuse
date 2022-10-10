import { computed } from 'vue-demi'
import { useMediaQuery } from '../useMediaQuery'
import type { ConfigurableWindow } from '../_configurable'

export type ContrastType = 'more' | 'less' | 'custom' | 'no-preference'

/**
 * Reactive prefers-contrast media query.
 *
 * @see https://vueuse.org/usePreferredContrast
 * @param [options]
 */
export function usePreferredContrast(options?: ConfigurableWindow) {
  const isMore = useMediaQuery('(prefers-contrast: more)', options)
  const isLess = useMediaQuery('(prefers-contrast: less)', options)
  const isCustom = useMediaQuery('(prefers-contrast: custom)', options)

  return computed<ContrastType>(() => {
    if (isMore.value)
      return 'more'
    if (isLess.value)
      return 'less'
    if (isCustom.value)
      return 'custom'
    return 'no-preference'
  })
}
