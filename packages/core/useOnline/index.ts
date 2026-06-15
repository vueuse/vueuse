import type { ConfigurableWindow } from '../_configurable'
import { useNetwork } from '../useNetwork'

/**
 * Reactive online state.
 *
 * @see https://vueuse.org/useOnline
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useOnline(options: ConfigurableWindow = {}) {
  const { isOnline } = useNetwork(options)
  return isOnline
}
