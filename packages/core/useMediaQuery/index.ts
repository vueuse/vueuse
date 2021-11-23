/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query: string, options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options

  let mediaQuery: MediaQueryList | undefined
  const matches = ref(false)

  const update = () => {
    if (!window)
      return
    if (!mediaQuery)
      mediaQuery = window.matchMedia(query)
    matches.value = mediaQuery.matches
  }

  tryOnMounted(() => {
    update()

    if (!mediaQuery)
      return

    if ('addEventListener' in mediaQuery)
      mediaQuery.addEventListener('change', update)
    else
      // @ts-expect-error
      mediaQuery.addListener(update)

    tryOnScopeDispose(() => {
      if ('removeEventListener' in update)
        mediaQuery!.removeEventListener('change', update)
      else
        mediaQuery!.removeListener(update)
    })
  })

  return matches
}
