/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { Ref, ref, watch } from '../../api'
import { useEventListener } from '../useEventListener'

export interface LocationSensorState {
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

export function useBrowserLocation (target: Ref<HTMLElement> = ref(document.body)) {
  const buildState = (trigger: string) => {
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
  useEventListener('pushstate', () => state.value = buildState('pushstate'))
  useEventListener('replacestate', () => state.value = buildState('replacestate'))

  watch(() => state, () => {
    console.log(state)
  }, { lazy: true })

  return state
}
