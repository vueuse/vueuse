/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { tryOnBeforeMount, tryOnScopeDispose } from '@vueuse/shared'
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
export function useMediaQuery(query: string, options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  const isSupported = useSupported(() => window && 'matchMedia' in window && typeof window!.matchMedia === 'function')

  let mediaQuery: MediaQueryList | undefined
  const matches = ref(false)

  const update = () => {
    if (!isSupported.value)
      return
    if (!mediaQuery)
      mediaQuery = window!.matchMedia(query)
    matches.value = mediaQuery.matches
  }

  tryOnBeforeMount(() => {
    update()

    if (!mediaQuery)
      return

    if ('addEventListener' in mediaQuery)
      mediaQuery.addEventListener('change', update)
    else
      // @ts-expect-error deprecated API
      mediaQuery.addListener(update)

    tryOnScopeDispose(() => {
      if ('removeEventListener' in mediaQuery!)
        mediaQuery!.removeEventListener('change', update)
      else
        mediaQuery!.removeListener(update)
    })
  })

  return matches
}
