import { ref } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
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
   * Whether rounded integers or double values should be returned
   * @default true
   * @description Takes effects only when `includeScrollbar` is `false`
   */
  roundedValue?: boolean
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
    initialWidth = Infinity,
    initialHeight = Infinity,
    listenOrientation = true,
    includeScrollbar = true,
    roundedValue = true,
  } = options

  const width = ref(initialWidth)
  const height = ref(initialHeight)

  const update = () => {
    if (window) {
      if (includeScrollbar) {
        width.value = window.innerWidth
        height.value = window.innerHeight
      }
      else if (roundedValue) {
        width.value = window.document.documentElement.clientWidth
        height.value = window.document.documentElement.clientHeight
      }
      else {
        // For certain cases that users want accurate double values instead of rounded integers (see #2486)
        // https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
        const viewport = window.visualViewport
        if (viewport) {
          width.value = window.visualViewport.width
          height.value = window.visualViewport.height
        }
      }
    }
  }

  update()
  tryOnMounted(update)
  useEventListener('resize', update, { passive: true })

  if (listenOrientation)
    useEventListener('orientationchange', update, { passive: true })

  return { width, height }
}

export type UseWindowSizeReturn = ReturnType<typeof useWindowSize>
