import { ref } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface WindowSizeOptions extends ConfigurableWindow {
  initialWidth?: number
  initialHeight?: number
}

/**
 * Reactive window size.
 *
 * @see https://vueuse.org/useWindowSize
 * @param options
 */
export function useWindowSize({ window = defaultWindow, initialWidth = Infinity, initialHeight = Infinity }: WindowSizeOptions = {}) {
  const width = ref(initialWidth)
  const height = ref(initialHeight)

  const update = () => {
    if (window) {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }
  }

  update()
  tryOnMounted(update)
  useEventListener('resize', update, { passive: true })

  return { width, height }
}

export type UseWindowSizeReturn = ReturnType<typeof useWindowSize>
