import { ref } from 'vue-demi'
import { tryOnMounted, tryOnUnmounted } from '@vueuse/shared'
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
  } = options

  const width = ref(initialWidth)
  const height = ref(initialHeight)

  const update = () => {
    if (window) {
      if (includeScrollbar) {
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

  // 1. Deprecated: orientationchange  https://developer.mozilla.org/en-US/docs/Web/API/Window/orientationchange_event
  // 2. window.innerWidth incorrect in browser after orientation change event
  let mediaOrientation: MediaQueryList
  if (listenOrientation) {
    if (window) {
      mediaOrientation = window.matchMedia('(orientation: portrait)')
      mediaOrientation && mediaOrientation.addEventListener('change', update)
    }
  }
  tryOnUnmounted(() => {
    mediaOrientation && mediaOrientation.removeEventListener('change', update)
  })
  // useEventListener('orientationchange', update, { passive: true })

  return { width, height }
}

export type UseWindowSizeReturn = ReturnType<typeof useWindowSize>
