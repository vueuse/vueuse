/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { objectEntries } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { reactive, ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

const WRITABLE_PROPERTIES = [
  'hash', 'host', 'hostname', 'href', 'pathname', 'port', 'protocol', 'search',
] as const

export interface BrowserLocationState {
  readonly trigger: string
  readonly state?: any
  readonly length?: number
  readonly origin?: string
  hash?: string
  host?: string
  hostname?: string
  href?: string
  pathname?: string
  port?: string
  protocol?: string
  search?: string
}

/**
 * Reactive browser location.
 *
 * @see https://vueuse.org/useBrowserLocation
 * @param options
 */
export function useBrowserLocation({ window = defaultWindow }: ConfigurableWindow = {}) {
  const refs = Object.fromEntries(
    WRITABLE_PROPERTIES.map(key => [key, ref()]),
  ) as Record<typeof WRITABLE_PROPERTIES[number], Ref<string | undefined>>

  for (const [key, ref] of objectEntries(refs)) {
    watch(ref, (value) => {
      if (!window?.location || window.location[key] === value)
        return
      window.location[key] = value!
    })
  }

  const buildState = (trigger: string): BrowserLocationState => {
    const { state, length } = window?.history || {}
    const { origin } = window?.location || {}

    for (const key of WRITABLE_PROPERTIES)
      refs[key].value = window?.location?.[key]

    return reactive({
      trigger,
      state,
      length,
      origin,
      ...refs,
    })
  }

  const state = ref(buildState('load'))

  if (window) {
    useEventListener(window, 'popstate', () => state.value = buildState('popstate'), { passive: true })
    useEventListener(window, 'hashchange', () => state.value = buildState('hashchange'), { passive: true })
  }

  return state
}

export type UseBrowserLocationReturn = ReturnType<typeof useBrowserLocation>
