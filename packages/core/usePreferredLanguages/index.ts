import type { Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

/**
 * Reactive Navigator Languages.
 *
 * @see https://vueuse.org/usePreferredLanguages
 * @param options
 */
export function usePreferredLanguages(options: ConfigurableWindow = {}): Ref<readonly string[]> {
  const { window = defaultWindow } = options
  if (!window)
    return ref(['en'])

  const navigator = window.navigator
  const value = ref<readonly string[]>(navigator.languages)

  useEventListener(window, 'languagechange', () => {
    value.value = navigator.languages
  }, { passive: true })

  return value
}
