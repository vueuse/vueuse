import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export function usePreferredLanguages({ window = defaultWindow }: ConfigurableWindow = {}) {
  if (!window)
    return ref('en')

  const navigator = window.navigator
  const value = ref(navigator.languages)

  useEventListener(window, 'languagechange', () => {
    value.value = navigator.languages
  })

  return value
}
