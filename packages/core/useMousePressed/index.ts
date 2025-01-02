import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { UseMouseSourceType } from '../useMouse'
import { computed, ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

export interface MousePressedOptions extends ConfigurableWindow {
  /**
   * Listen to `touchstart` `touchend` events
   *
   * @default true
   */
  touch?: boolean

  /**
   * Listen to `dragstart` `drop` and `dragend` events
   *
   * @default true
   */
  drag?: boolean

  /**
   * Add event listerners with the `capture` option set to `true`
   * (see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#capture))
   *
   * @default false
   */
  capture?: boolean

  /**
   * Initial values
   *
   * @default false
   */
  initialValue?: boolean

  /**
   * Element target to be capture the click
   */
  target?: MaybeComputedElementRef

  /**
   * Callback to be called when the mouse is pressed
   *
   * @param event
   */
  onPressed?: (event: MouseEvent | TouchEvent | DragEvent) => void

  /**
   * Callback to be called when the mouse is released
   *
   * @param event
   */
  onReleased?: (event: MouseEvent | TouchEvent | DragEvent) => void
}

/**
 * Reactive mouse pressing state.
 *
 * @see https://vueuse.org/useMousePressed
 * @param options
 */
export function useMousePressed(options: MousePressedOptions = {}) {
  const {
    touch = true,
    drag = true,
    capture = false,
    initialValue = false,
    window = defaultWindow,
  } = options

  const pressed = ref(initialValue)
  const sourceType = ref<UseMouseSourceType>(null)

  if (!window) {
    return {
      pressed,
      sourceType,
    }
  }

  const onPressed = (srcType: UseMouseSourceType) => (event: MouseEvent | TouchEvent | DragEvent) => {
    pressed.value = true
    sourceType.value = srcType
    options.onPressed?.(event)
  }
  const onReleased = (event: MouseEvent | TouchEvent | DragEvent) => {
    pressed.value = false
    sourceType.value = null
    options.onReleased?.(event)
  }

  const target = computed(() => unrefElement(options.target) || window)

  useEventListener<MouseEvent>(target, 'mousedown', onPressed('mouse'), { passive: true, capture })

  useEventListener<MouseEvent>(window, 'mouseleave', onReleased, { passive: true, capture })
  useEventListener<MouseEvent>(window, 'mouseup', onReleased, { passive: true, capture })

  if (drag) {
    useEventListener<DragEvent>(target, 'dragstart', onPressed('mouse'), { passive: true, capture })

    useEventListener<DragEvent>(window, 'drop', onReleased, { passive: true, capture })
    useEventListener<DragEvent>(window, 'dragend', onReleased, { passive: true, capture })
  }

  if (touch) {
    useEventListener<TouchEvent>(target, 'touchstart', onPressed('touch'), { passive: true, capture })

    useEventListener<TouchEvent>(window, 'touchend', onReleased, { passive: true, capture })
    useEventListener<TouchEvent>(window, 'touchcancel', onReleased, { passive: true, capture })
  }

  return {
    pressed,
    sourceType,
  }
}

export type UseMousePressedReturn = ReturnType<typeof useMousePressed>
