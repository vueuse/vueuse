import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 * Reactive window scroll.
 *
 * @see https://vueuse.org/useWindowScroll
 * @param options
 */
export function useWindowScroll({ window = defaultWindow }: ConfigurableWindow = {}) {
  if (!window) {
    return {
      x: ref(0),
      y: ref(0),
    }
  }

  const x = ref(window.scrollX)
  const y = ref(window.scrollY)

  useEventListener(
    window,
    'scroll',
    () => {
      x.value = window.scrollX
      y.value = window.scrollY
    },
    {
      capture: false,
      passive: true,
    },
  )

  return { x, y }
}

export type UseWindowScrollReturn = ReturnType<typeof useWindowScroll>
