/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactive Media Query.
 *
 * @see   {@link https://vueuse.org/useMediaQuery}
 * @param query
 * @param options
 */
export function useMediaQuery(query: string, options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  if (!window)
    return ref(false)

  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  if ('addEventListener' in mediaQuery) {
    mediaQuery.addEventListener('change', handler)
  }
  else {
    // @ts-expect-error - fallback for Safari < 14 and older browsers
    mediaQuery.addListener(handler)
  }

  tryOnUnmounted(() => {
    if ('removeEventListener' in mediaQuery) {
      mediaQuery.removeEventListener('change', handler)
    }
    else {
      // @ts-expect-error - fallback for Safari < 14 and older browsers
      mediaQuery.removeListener(handler)
    }
  })

  return matches
}
