import { onMounted, onUnmounted, ref } from '../api'

export function usePreferredLanguages () {
  const value = ref(navigator.languages)

  function handler () {
    value.value = navigator.languages
  }

  onMounted(() => {
    window.addEventListener('languagechange', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('languagechange', handler)
  })

  return value
}
