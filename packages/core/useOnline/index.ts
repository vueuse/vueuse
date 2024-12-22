import type { ConfigurableWindow } from '../_configurable'
import { useNetwork } from '../useNetwork'

/**
 * Reactive online state.
 *
 * @see https://vueuse.org/useOnline
 * @param options
 */
export function useOnline(options: ConfigurableWindow = {}) {
  const { isOnline } = useNetwork(options)
  return isOnline
}
