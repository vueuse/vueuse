import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 * @deprecated Please use [`usescroll`](https://vueuse.org/core/usescroll/#usescroll) instead.
 */
export function useWindowScroll({ window = defaultWindow }: ConfigurableWindow = {}) {
  if (!window) {
    return {
      x: ref(0),
      y: ref(0),
    }
  }

  const x = ref(window.pageXOffset)
  const y = ref(window.pageYOffset)

  useEventListener(
    window,
    'scroll',
    () => {
      x.value = window.pageXOffset
      y.value = window.pageYOffset
    },
    {
      capture: false,
      passive: true,
    },
  )

  return { x, y }
}

export type UseWindowScrollReturn = ReturnType<typeof useWindowScroll>
