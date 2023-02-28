import { ref } from 'vue-demi'
import type { ConfigurableEventFilter } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import type { Position } from '../types'

export interface UseMouseOptions extends ConfigurableWindow, ConfigurableEventFilter {
  /**
   * Mouse position based by page, client, or relative to previous position
   *
   * @default 'page'
   */
  type?: 'page' | 'client' | 'movement'

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
  initialValue?: Position
}

export type MouseSourceType = 'mouse' | 'touch' | null

/**
 * Reactive mouse position.
 *
 * @see https://vueuse.org/useMouse
 * @param options
 */
export function useMouse(options: UseMouseOptions = {}) {
  const {
    type = 'page',
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    window = defaultWindow,
    eventFilter,
  } = options

  const x = ref(initialValue.x)
  const y = ref(initialValue.y)
  const sourceType = ref<MouseSourceType>(null)

  const mouseHandler = (event: MouseEvent) => {
    if (type === 'page') {
      x.value = event.pageX
      y.value = event.pageY
    }
    else if (type === 'client') {
      x.value = event.clientX
      y.value = event.clientY
    }
    else if (type === 'movement') {
      x.value = event.movementX
      y.value = event.movementY
    }
    sourceType.value = 'mouse'
  }
  const reset = () => {
    x.value = initialValue.x
    y.value = initialValue.y
  }
  const touchHandler = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      if (type === 'page') {
        x.value = touch.pageX
        y.value = touch.pageY
      }
      else if (type === 'client') {
        x.value = touch.clientX
        y.value = touch.clientY
      }
      sourceType.value = 'touch'
    }
  }

  const mouseHandlerWrapper = (event: MouseEvent) => {
    return eventFilter === undefined ? mouseHandler(event) : eventFilter(() => mouseHandler(event), {} as any)
  }

  const touchHandlerWrapper = (event: TouchEvent) => {
    return eventFilter === undefined ? touchHandler(event) : eventFilter(() => touchHandler(event), {} as any)
  }

  if (window) {
    useEventListener(window, 'mousemove', mouseHandlerWrapper, { passive: true })
    useEventListener(window, 'dragover', mouseHandlerWrapper, { passive: true })
    if (touch && type !== 'movement') {
      useEventListener(window, 'touchstart', touchHandlerWrapper, { passive: true })
      useEventListener(window, 'touchmove', touchHandlerWrapper, { passive: true })
      if (resetOnTouchEnds)
        useEventListener(window, 'touchend', reset, { passive: true })
    }
  }

  return {
    x,
    y,
    sourceType,
  }
}

export type UseMouseReturn = ReturnType<typeof useMouse>
