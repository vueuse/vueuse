import { useMediaQuery } from '../useMediaQuery'
import { computed } from 'vue-demi'

export function usePreferredColorScheme() {
  const isLight = useMediaQuery('(prefers-color-scheme: light)')
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  return computed(() => {
    if (isDark.value) return 'dark'
    if (isLight.value) return 'light'
    return 'no-preference'
  })
}
