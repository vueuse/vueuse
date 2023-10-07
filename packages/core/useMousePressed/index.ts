import { computed, ref } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { UseMouseSourceType } from '../useMouse'
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
  target?: MaybeElementRef
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

  const onPressed = (srcType: UseMouseSourceType) => () => {
    pressed.value = true
    sourceType.value = srcType
  }
  const onReleased = () => {
    pressed.value = false
    sourceType.value = null
  }

  const target = computed(() => unrefElement(options.target) || window)

  useEventListener(target, 'mousedown', onPressed('mouse'), { passive: true, capture })

  useEventListener(window, 'mouseleave', onReleased, { passive: true, capture })
  useEventListener(window, 'mouseup', onReleased, { passive: true, capture })

  if (drag) {
    useEventListener(target, 'dragstart', onPressed('mouse'), { passive: true, capture })

    useEventListener(window, 'drop', onReleased, { passive: true, capture })
    useEventListener(window, 'dragend', onReleased, { passive: true, capture })
  }

  if (touch) {
    useEventListener(target, 'touchstart', onPressed('touch'), { passive: true, capture })

    useEventListener(window, 'touchend', onReleased, { passive: true, capture })
    useEventListener(window, 'touchcancel', onReleased, { passive: true, capture })
  }

  return {
    pressed,
    sourceType,
  }
}

export type UseMousePressedReturn = ReturnType<typeof useMousePressed>
