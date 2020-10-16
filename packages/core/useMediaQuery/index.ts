/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { isClient, tryOnUnmounted } from '../utils'

// Safari seems not to support event listeners on matchMedia
// https://bugs.webkit.org/show_bug.cgi?id=203288
// adapted from https://stackoverflow.com/a/60000747
function matchMediaListener(mediaQuery: any, handler: (event: MediaQueryListEvent) => void) {
  if (!mediaQuery || !handler || typeof handler !== 'function') return

  try {
    // Chrome & Firefox
    mediaQuery.addEventListener('change', handler)
  }
  catch (e1) {
    try {
      // Safari
      mediaQuery.addListener(handler)
    }
    catch (e2) {
      console.error(e1, e2)
    }
  }
}

export function useMediaQuery(query: string) {
  // try to fetch initial value (avoid SSR issues)
  if (!isClient)
    return ref(false)

  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  matchMediaListener(mediaQuery, handler)

  tryOnUnmounted(() => {
    matchMediaListener(mediaQuery, handler)
  })

  return matches
}
