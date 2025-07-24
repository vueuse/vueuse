import type { ConfigurableWindow } from '../_configurable'
import { useMediaQuery } from '../useMediaQuery'

/**
 * Reactive dark theme preference.
 *
 * @see https://vueuse.org/usePreferredDark
 * @param [options]
 *
 * @__NO_SIDE_EFFECTS__
 */
export function usePreferredDark(options?: ConfigurableWindow) {
  return useMediaQuery('(prefers-color-scheme: dark)', options)
}
