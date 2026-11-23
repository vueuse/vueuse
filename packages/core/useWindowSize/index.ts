import type { MaybeRefInitials, ReadonlyRefs } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { tryOnMounted } from '@vueuse/shared'
import { shallowReadonly, shallowRef, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useMediaQuery } from '../useMediaQuery'

export interface UseWindowSizeState {
  /**
   * Window width
   *
   * @default Number.POSITIVE_INFINITY
   */
  width: number
  /**
   * Window height
   *
   * @default Number.POSITIVE_INFINITY
   */
  height: number
}

export interface UseWindowSizeOptions extends ConfigurableWindow {
  /**
   * Initial values for the returned state, used before the window is measured
   * (e.g. during SSR). A passed ref is used as the internal state.
   */
  initials?: MaybeRefInitials<UseWindowSizeState>
  /**
   * @deprecated Use `initials.width` instead. Will be removed in v17.
   */
  initialWidth?: number
  /**
   * @deprecated Use `initials.height` instead. Will be removed in v17.
   */
  initialHeight?: number
  /**
   * Listen to window `orientationchange` event
   *
   * @default true
   */
  listenOrientation?: boolean

  /**
   * Whether the scrollbar should be included in the width and height
   * Only effective when `type` is `'inner'`
   *
   * @default true
   */
  includeScrollbar?: boolean

  /**
   * Use `window.innerWidth` or `window.outerWidth` or `window.visualViewport`
   * visualViewport documentation from MDN(https://developer.mozilla.org/zh-CN/docs/Web/API/VisualViewport)
   * @default 'inner'
   */
  type?: 'inner' | 'outer' | 'visual'
}

export interface UseWindowSizeReturn extends ReadonlyRefs<UseWindowSizeState> {}

/**
 * Reactive window size.
 *
 * @see https://vueuse.org/useWindowSize
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): UseWindowSizeReturn {
  const {
    window = defaultWindow,
    initialWidth: deprecatedInitialWidth,
    initialHeight: deprecatedInitialHeight,
    initials: {
      width: initialWidth = deprecatedInitialWidth ?? Number.POSITIVE_INFINITY,
      height: initialHeight = deprecatedInitialHeight ?? Number.POSITIVE_INFINITY,
    } = {},
    listenOrientation = true,
    includeScrollbar = true,
    type = 'inner',
  } = options

  const width = shallowRef(initialWidth)
  const height = shallowRef(initialHeight)

  const update = () => {
    if (window) {
      if (type === 'outer') {
        width.value = window.outerWidth
        height.value = window.outerHeight
      }
      else if (type === 'visual' && window.visualViewport) {
        const { width: visualViewportWidth, height: visualViewportHeight, scale } = window.visualViewport
        width.value = Math.round(visualViewportWidth * scale)
        height.value = Math.round(visualViewportHeight * scale)
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

  const listenerOptions = { passive: true }
  useEventListener('resize', update, listenerOptions)

  if (window && type === 'visual' && window.visualViewport) {
    useEventListener(window.visualViewport, 'resize', update, listenerOptions)
  }

  if (listenOrientation) {
    const matches = useMediaQuery('(orientation: portrait)')
    watch(matches, () => update())
  }

  return {
    width: shallowReadonly(width),
    height: shallowReadonly(height),
  }
}
