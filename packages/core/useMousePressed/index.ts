import type { MaybeRefInitials, ReadonlyRefs } from '@vueuse/shared'
import type { ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { UseMouseSourceType } from '../useMouse'
import { computed, shallowReadonly, shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

export interface UseMousePressedState {
  /**
   * Whether the mouse (or touch) is pressed
   *
   * @default false
   */
  pressed: boolean
}

export interface UseMousePressedOptions extends ConfigurableWindow {
  /**
   * Initial values for the returned state, used before the first event.
   * A passed ref is used as the internal state.
   */
  initials?: MaybeRefInitials<UseMousePressedState>

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
   * Add event listeners with the `capture` option set to `true`
   * (see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#capture))
   *
   * @default false
   */
  capture?: boolean

  /**
   * @deprecated Use `initials.pressed` instead. Will be removed in v17.
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

/** @deprecated use {@link UseMousePressedOptions} instead */
export type MousePressedOptions = UseMousePressedOptions

export interface UseMousePressedReturn extends ReadonlyRefs<UseMousePressedState> {
  /**
   * Source of the current press, `null` when released
   */
  sourceType: Readonly<ShallowRef<UseMouseSourceType>>
}

/**
 * Reactive mouse pressing state.
 *
 * @see https://vueuse.org/useMousePressed
 * @param options
 */
export function useMousePressed(options: UseMousePressedOptions = {}): UseMousePressedReturn {
  const {
    touch = true,
    drag = true,
    capture = false,
    initialValue: deprecatedInitialValue,
    initials: {
      pressed: initialPressed = deprecatedInitialValue ?? false,
    } = {},
    window = defaultWindow,
  } = options

  const pressed = shallowRef(initialPressed)
  const sourceType = shallowRef<UseMouseSourceType>(null)

  const returnValue: UseMousePressedReturn = {
    pressed: shallowReadonly(pressed),
    sourceType: shallowReadonly(sourceType),
  }

  if (!window)
    return returnValue

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

  const listenerOptions = { passive: true, capture }
  useEventListener<MouseEvent>(target, 'mousedown', onPressed('mouse'), listenerOptions)

  useEventListener<MouseEvent>(window, 'mouseleave', onReleased, listenerOptions)
  useEventListener<MouseEvent>(window, 'mouseup', onReleased, listenerOptions)

  if (drag) {
    useEventListener<DragEvent>(target, 'dragstart', onPressed('mouse'), listenerOptions)

    useEventListener<DragEvent>(window, 'drop', onReleased, listenerOptions)
    useEventListener<DragEvent>(window, 'dragend', onReleased, listenerOptions)
  }

  if (touch) {
    useEventListener<TouchEvent>(target, 'touchstart', onPressed('touch'), listenerOptions)

    useEventListener<TouchEvent>(window, 'touchend', onReleased, listenerOptions)
    useEventListener<TouchEvent>(window, 'touchcancel', onReleased, listenerOptions)
  }

  return returnValue
}
