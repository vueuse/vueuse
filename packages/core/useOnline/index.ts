import type { ConfigurableWindow } from '../_configurable'
import { useNetwork } from '../useNetwork'

/**
 * Reactive online state.
 *
 * @see https://vueuse.org/core/useOnline
 * @param options
 */
export function useOnline(options: ConfigurableWindow = {}) {
  const { isOnline } = useNetwork(options)
  return isOnline
}
