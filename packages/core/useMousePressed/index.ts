import { computed, ref } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { MouseButtonMap } from '../useMouse'
import type { UseMouseButton, UseMouseSourceType } from '../useMouse'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

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
   * Initial values
   *
   * @default false
   */
  initialValue?: boolean

  /**
   * Element target to be capture the click
   */
  target?: MaybeElementRef

  /**
   * Mouse button to be captured
   */
  mouseButton?: UseMouseButton
}

/**
 * Reactive mouse position.
 *
 * @see https://vueuse.org/useMousePressed
 * @param options
 */
export function useMousePressed(options: MousePressedOptions = {}) {
  const {
    touch = true,
    drag = true,
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

  const target = computed(() => unrefElement(options.target) || window)

  const onPressed = (srcType: UseMouseSourceType) => (e: MouseEvent) => {
    const mouseButton = MouseButtonMap[options.mouseButton || '']
    if (mouseButton !== undefined && mouseButton !== e.button)
      return
    if (options.mouseButton === 'right')
      useEventListener(target, 'contextmenu', (event) => { event.preventDefault() })

    pressed.value = true
    sourceType.value = srcType
  }
  const onReleased = (e: MouseEvent) => {
    const mouseButton = MouseButtonMap[options.mouseButton || '']
    if (mouseButton !== undefined && mouseButton !== e.button && options.mouseButton !== 'right')
      return
    pressed.value = false
    sourceType.value = null
  }

  useEventListener(target, 'mousedown', onPressed('mouse'), { passive: true })

  useEventListener(window, 'mouseleave', onReleased, { passive: true })
  useEventListener(window, 'mouseup', onReleased, { passive: true })

  if (drag) {
    useEventListener(target, 'dragstart', onPressed('mouse'), { passive: true })

    useEventListener(window, 'drop', onReleased, { passive: true })
    useEventListener(window, 'dragend', onReleased, { passive: true })
  }

  if (touch) {
    useEventListener(target, 'touchstart', onPressed('touch'), { passive: true })

    useEventListener(window, 'touchend', onReleased, { passive: true })
    useEventListener(window, 'touchcancel', onReleased, { passive: true })
  }

  return {
    pressed,
    sourceType,
  }
}

export type UseMousePressedReturn = ReturnType<typeof useMousePressed>
