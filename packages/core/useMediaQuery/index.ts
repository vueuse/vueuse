/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { pxValue } from '@vueuse/shared'
import { computed, shallowRef, toValue, watchEffect } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSSRWidth } from '../useSSRWidth'
import { useSupported } from '../useSupported'

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query: MaybeRefOrGetter<string>, options: ConfigurableWindow & { ssrWidth?: number } = {}) {
  const { window = defaultWindow, ssrWidth = useSSRWidth() } = options
  const isSupported = useSupported(() => window && 'matchMedia' in window && typeof window.matchMedia === 'function')

  const ssrSupport = shallowRef(typeof ssrWidth === 'number')

  const mediaQuery = shallowRef<MediaQueryList>()
  const matches = shallowRef(false)

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  watchEffect(() => {
    if (ssrSupport.value) {
      // Exit SSR support on mounted if window available
      ssrSupport.value = !isSupported.value

      const queryStrings = toValue(query).split(',')
      matches.value = queryStrings.some((queryString) => {
        const not = queryString.includes('not all')
        const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/)
        const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/)
        let res = Boolean(minWidth || maxWidth)
        if (minWidth && res) {
          res = ssrWidth! >= pxValue(minWidth[1])
        }
        if (maxWidth && res) {
          res = ssrWidth! <= pxValue(maxWidth[1])
        }
        return not ? !res : res
      })
      return
    }
    if (!isSupported.value)
      return

    mediaQuery.value = window!.matchMedia(toValue(query))
    matches.value = mediaQuery.value.matches
  })

  useEventListener(mediaQuery, 'change', handler, { passive: true })

  return computed(() => matches.value)
}
