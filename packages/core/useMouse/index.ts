import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface MouseOptions extends ConfigurableWindow {
  /**
   * Listen to `touchmove` events
   *
   * @default true
   */
  touch?: boolean

  /**
   * Reset to initial value when `touchend` event fired
   *
   * @default false
   */
  resetOnTouchEnds?: boolean

  /**
   * Initial values
   */
  initialValue?: {x: number; y: number}
}

export type MouseSourceType = 'mouse' | 'touch' | null

/**
 * Reactive mouse position
 *
 * @see   {@link https://vueuse.js.org/useMouse}
 * @param options
 */
export function useMouse(options: MouseOptions = {}) {
  const {
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    window = defaultWindow,
  } = options

  const x = ref(initialValue.x)
  const y = ref(initialValue.y)
  const sourceType = ref<MouseSourceType>(null)

  if (window) {
    useEventListener(window, 'mousemove', (event) => {
      x.value = event.pageX
      y.value = event.pageY
      sourceType.value = 'mouse'
    })

    if (touch) {
      const touchHandler = (event: TouchEvent) => {
        if (event.touches.length > 0) {
          x.value = event.touches[0].clientX
          y.value = event.touches[0].clientY
          sourceType.value = 'touch'
        }
      }
      useEventListener(window, 'touchstart', touchHandler)
      useEventListener(window, 'touchmove', touchHandler)
      if (resetOnTouchEnds) {
        useEventListener(window, 'touchend', () => {
          x.value = initialValue.x
          y.value = initialValue.y
        })
      }
    }
  }

  return {
    x,
    y,
    sourceType,
  }
}
