/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, watchEffect } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import { useSupported } from '../useSupported'

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query: MaybeRefOrGetter<string>, options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  const isSupported = useSupported(() => window && 'matchMedia' in window && typeof window.matchMedia === 'function')

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

  return matches
}
