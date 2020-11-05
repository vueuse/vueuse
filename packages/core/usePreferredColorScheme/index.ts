import { useMediaQuery } from '../useMediaQuery'
import { computed } from 'vue-demi'
import { ConfigurableWindow } from '../_configurable'

export function usePreferredColorScheme(options?: ConfigurableWindow) {
  const isLight = useMediaQuery('(prefers-color-scheme: light)', options)
  const isDark = useMediaQuery('(prefers-color-scheme: dark)', options)

  return computed(() => {
    if (isDark.value)
      return 'dark'
    if (isLight.value)
      return 'light'
    return 'no-preference'
  })
}
