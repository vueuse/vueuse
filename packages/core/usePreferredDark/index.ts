import { useMediaQuery } from '../useMediaQuery'
import { ConfigurableWindow } from '../_configurable'

/**
 * Reactive dark theme preference.
 *
 * @see   {@link https://vueuse.org/usePreferredDark}
 * @param [options]
 */
export function usePreferredDark(options?: ConfigurableWindow) {
  return useMediaQuery('(prefers-color-scheme: dark)', options)
}
