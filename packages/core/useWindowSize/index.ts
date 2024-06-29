import { tryOnMounted } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { useMediaQuery } from '../useMediaQuery'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseWindowSizeOptions extends ConfigurableWindow {
  initialWidth?: number
  initialHeight?: number
  /**
   * Listen to window `orientationchange` event
   *
   * @default true
   */
  listenOrientation?: boolean

  /**
   * Whether the scrollbar should be included in the width and height
   * @default true
   */
  includeScrollbar?: boolean

  /**
   * Whether to use the window.outerWidth and window.outerHeight instead of window.innerWidth and window.innerHeight
   * @default false
   */
  useOuterSize?: boolean
}

/**
 * Reactive window size.
 *
 * @see https://vueuse.org/useWindowSize
 * @param options
 */
export function useWindowSize(options: UseWindowSizeOptions = {}) {
  const {
    window = defaultWindow,
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    listenOrientation = true,
    includeScrollbar = true,
    useOuterSize = false,
  } = options

  const width = ref(initialWidth)
  const height = ref(initialHeight)

  const update = () => {
    if (window) {
      if (useOuterSize) {
        width.value = window.outerWidth
        height.value = window.outerHeight
      }
      else if (includeScrollbar) {
        width.value = window.innerWidth
        height.value = window.innerHeight
      }
      else {
        width.value = window.document.documentElement.clientWidth
        height.value = window.document.documentElement.clientHeight
      }
    }
  }

  update()
  tryOnMounted(update)
  useEventListener('resize', update, { passive: true })

  if (listenOrientation) {
    const matches = useMediaQuery('(orientation: portrait)')
    watch(matches, () => update())
  }

  return { width, height }
}

export type UseWindowSizeReturn = ReturnType<typeof useWindowSize>
