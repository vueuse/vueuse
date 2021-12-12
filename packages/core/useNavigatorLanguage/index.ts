import { ref, Ref } from 'vue-demi'

import { useEventListener } from '../useEventListener'

/**
 *
 * Reactive useNavigatorLanguage
 *
 * Detects the currently selected user language and returns a reactive language
 * @see https://vueuse.org/useNavigatorLanguage
 *
 */
export const useNavigatorLanguage = () => {
  const language: Ref<string> = ref<string>(navigator.language)

  // Listen to when to user changes langauge:
  useEventListener(window, 'languagechange', () => {
    language.value = navigator.language
  })

  return {
    language,
  }
}

export type UseNavigatorLanguageReturn = ReturnType<typeof useNavigatorLanguage>
