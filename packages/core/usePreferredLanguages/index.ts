import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactive Navigator Languages.
 *
 * @see   {@link https://vueuse.js.org/usePreferredLanguages}
 * @param options
 */
export function usePreferredLanguages(options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  if (!window)
    return ref('en')

  const navigator = window.navigator
  const value = ref(navigator.languages)

  useEventListener(window, 'languagechange', () => {
    value.value = navigator.languages
  })

  return value
}
