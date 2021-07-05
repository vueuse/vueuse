import { Ref, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactively track window focus with `window.onfocus` and `window.onblur`.
 *
 * @see https://vueuse.org/useWindowFocus
 * @param options
 */
export function useWindowFocus({ window = defaultWindow }: ConfigurableWindow = {}): Ref<boolean> {
  if (!window)
    return ref(false)

  const focused = ref(window.document.hasFocus())

  useEventListener(window, 'blur', () => {
    focused.value = false
  })

  useEventListener(window, 'focus', () => {
    focused.value = true
  })

  return focused
}
