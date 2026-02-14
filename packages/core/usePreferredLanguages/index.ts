import type { ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

/**
 * Reactive Navigator Languages.
 *
 * @see https://vueuse.org/usePreferredLanguages
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function usePreferredLanguages(options: ConfigurableWindow = {}): ShallowRef<readonly string[]> {
  const { window = defaultWindow } = options
  if (!window)
    return shallowRef(['en'])

  const navigator = window.navigator
  const value = shallowRef<readonly string[]>(navigator.languages)

  useEventListener(window, 'languagechange', () => {
    value.value = navigator.languages
  }, { passive: true })

  return value
}
