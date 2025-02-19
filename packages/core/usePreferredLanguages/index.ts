import type { Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { ref as deepRef } from 'vue'
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
    return deepRef(['en'])

  const navigator = window.navigator
  const value = deepRef<readonly string[]>(navigator.languages)

  useEventListener(window, 'languagechange', () => {
    value.value = navigator.languages
  }, { passive: true })

  return value
}
