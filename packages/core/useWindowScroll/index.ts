import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

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
