/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, onMounted, onUnmounted } from 'vue-demi'

export function useMediaQuery(query: string) {
  let mediaQuery!: MediaQueryList

  // try to fetch initial value (avoid SSR issues)
  if (typeof window !== 'undefined')
    mediaQuery = window.matchMedia(query)

  const matches = ref(mediaQuery ? mediaQuery.matches : false)
  function handler(event: MediaQueryListEvent) {
    matches.value = event.matches
  }

  onMounted(() => {
    if (!mediaQuery)
      mediaQuery = window.matchMedia(query)

    matches.value = mediaQuery.matches
    mediaQuery.addListener(handler)
  })

  onUnmounted(() => {
    mediaQuery.removeListener(handler)
  })

  return matches
}
