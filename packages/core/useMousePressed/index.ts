import { Fn, MaybeRef } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { MouseSourceType } from '../useMouse'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface MousePressedOptions extends ConfigurableWindow {
  /**
   * Listen to `touchstart` `touchend` events
   *
   * @default true
   */
  touch?: boolean

  /**
   * Initial values
   *
   * @default false
   */
  initialValue?: boolean

  /**
   * Element target to be capture the click
   */
  target?: MaybeRef<Element | null |undefined>
}

/**
 * Reactive mouse position.
 *
 * @see   {@link https://vueuse.js.org/useMousePressed}
 * @param options
 */
export function useMousePressed(options: MousePressedOptions = {}) {
  const {
    touch = true,
    initialValue = false,
    window = defaultWindow,
  } = options

  const target = ref(options.target)
  const pressed = ref(initialValue)
  const sourceType = ref<MouseSourceType>(null)

  let listeners: Fn[] = []

  if (window) {
    const cleanup = () => {
      listeners.forEach(f => f())
      listeners = []
    }
    const onReleased = () => {
      pressed.value = false
      sourceType.value = null
    }

    watch(
      target,
      () => {
        cleanup()

        const t = target.value || window
        listeners.push(useEventListener(t, 'mousedown',
          () => {
            pressed.value = true
            sourceType.value = 'mouse'
          },
          { passive: true },
        ))

        if (touch) {
          listeners.push(useEventListener(t, 'touchstart',
            () => {
              pressed.value = true
              sourceType.value = 'touch'
            },
            { passive: true },
          ))
        }
      },
      { immediate: true },
    )

    useEventListener(window, 'mouseleave', onReleased, { passive: true })
    useEventListener(window, 'mouseup', onReleased, { passive: true })

    if (touch) {
      useEventListener(window, 'touchend', onReleased, { passive: true })
      useEventListener(window, 'touchcancel', onReleased, { passive: true })
    }
  }

  return {
    pressed,
    sourceType,
  }
}
