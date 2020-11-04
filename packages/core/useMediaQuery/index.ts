/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { isClient, tryOnUnmounted } from '@vueuse/shared'

export function useMediaQuery(query: string) {
  // try to fetch initial value (avoid SSR issues)
  if (!isClient)
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
    // @ts-ignore
    // Adds fallback for Safari < 14 and older browsers
    mediaQuery.addListener(handler)
  }

  tryOnUnmounted(() => {
    if ('removeEventListener' in mediaQuery) {
      mediaQuery.removeEventListener('change', handler)
    }
    else {
      // @ts-ignore
      // Adds fallback for Safari < 14 and older browsers
      mediaQuery.removeListener(handler)
    }
  })

  return matches
}
