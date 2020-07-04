import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export function usePreferredLanguages() {
  const value = ref(navigator.languages)

  useEventListener('languagechange', () => {
    value.value = navigator.languages
  })

  return value
}
