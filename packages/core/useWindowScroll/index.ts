import { computed, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseWindowScroll extends ConfigurableWindow {
  behavior?: ScrollBehavior
}

/**
 * Reactive window scroll.
 *
 * @see https://vueuse.org/useWindowScroll
 * @param options
 */
export function useWindowScroll({ window = defaultWindow, behavior = 'auto' }: UseWindowScroll = {}) {
  const internalX = ref(0)
  const internalY = ref(0)

  if (!window) {
    return {
      x: internalX,
      y: internalY,
    }
  }

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
