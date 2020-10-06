/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { isClient, tryOnUnmounted } from '../utils'

export function useMediaQuery(query: string) {
  // try to fetch initial value (avoid SSR issues)
  if (!isClient)
    return ref(false)

  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  mediaQuery.addEventListener('change', handler)

  tryOnUnmounted(() => {
    mediaQuery.addEventListener('change', handler)
  })

  return matches
}
