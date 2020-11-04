/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export interface BrowserLocationState {
  trigger: string
  state?: any
  length?: number
  hash?: string
  host?: string
  hostname?: string
  href?: string
  origin?: string
  pathname?: string
  port?: string
  protocol?: string
  search?: string
}

export function useBrowserLocation() {
  const buildState = (trigger: string): BrowserLocationState => {
    const { state, length } = history

    const { hash, host, hostname, href, origin, pathname, port, protocol, search } = location

    return {
      trigger,
      state,
      length,
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search,
    }
  }

  const state = ref(buildState('load'))

  useEventListener('popstate', () => state.value = buildState('popstate'))

  return state
}
