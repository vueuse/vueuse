import type { Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

/**
 * Reactively track window focus with `window.onfocus` and `window.onblur`.
 *
 * @see https://vueuse.org/useWindowFocus
 */
export function useWindowFocus(options: ConfigurableWindow = {}): Ref<boolean> {
  const { window = defaultWindow } = options
  if (!window)
    return ref(false)

  const focused = ref(window.document.hasFocus())

  const listenerOptions = { passive: true }

  useEventListener(window, 'blur', () => {
    focused.value = false
  }, listenerOptions)

  useEventListener(window, 'focus', () => {
    focused.value = true
  }, listenerOptions)

  return focused
}
