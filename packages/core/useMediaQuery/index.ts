/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { pxValue, tryOnScopeDispose } from '@vueuse/shared'
import { computed, ref, toValue, watchEffect } from 'vue'
import { defaultWindow } from '../_configurable'
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

  const ssrSupport = ref(typeof ssrWidth === 'number')

  let mediaQuery: MediaQueryList | undefined
  const matches = ref(false)

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  const cleanup = () => {
    if (!mediaQuery)
      return
    if ('removeEventListener' in mediaQuery)
      mediaQuery.removeEventListener('change', handler)
    else
      // @ts-expect-error deprecated API
      mediaQuery.removeListener(handler)
  }

  const stopWatch = watchEffect(() => {
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

    cleanup()

    mediaQuery = window!.matchMedia(toValue(query))

    if ('addEventListener' in mediaQuery)
      mediaQuery.addEventListener('change', handler)
    else
      // @ts-expect-error deprecated API
      mediaQuery.addListener(handler)

    matches.value = mediaQuery.matches
  })

  tryOnScopeDispose(() => {
    stopWatch()
    cleanup()
    mediaQuery = undefined
  })

  return computed(() => matches.value)
}
