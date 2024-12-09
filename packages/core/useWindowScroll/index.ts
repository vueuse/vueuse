import type { ConfigurableWindow } from '../_configurable'
import { computed, ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UseWindowScrollOptions extends ConfigurableWindow {
  behavior?: ScrollBehavior
}

/**
 * Reactive window scroll.
 *
 * @see https://vueuse.org/useWindowScroll
 * @param options
 */

export function useWindowScroll(options: UseWindowScrollOptions = {}) {
  const { window = defaultWindow, behavior = 'auto' } = options
  if (!window) {
    return {
      x: ref(0),
      y: ref(0),
    }
  }

  const internalX = ref(window.scrollX)
  const internalY = ref(window.scrollY)

  const x = computed({
    get() {
      return internalX.value
    },
    set(x: number) {
      scrollTo({ left: x, behavior })
    },
  })
  const y = computed({
    get() {
      return internalY.value
    },
    set(y: number) {
      scrollTo({ top: y, behavior })
    },
  })

  useEventListener(
    window,
    'scroll',
    () => {
      internalX.value = window.scrollX
      internalY.value = window.scrollY
    },
    {
      capture: false,
      passive: true,
    },
  )

  return { x, y }
}

export type UseWindowScrollReturn = ReturnType<typeof useWindowScroll>
