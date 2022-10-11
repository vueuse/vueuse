import { computed } from 'vue-demi'
import { defaultWindow } from '../_configurable'
import { usePreferredDark } from '../usePreferredDark'
import type { BasicColorSchema, UseColorModeOptions } from '../useColorMode'
import { useColorMode } from '../useColorMode'

export interface UseDarkOptions extends Omit<UseColorModeOptions<BasicColorSchema>, 'modes' | 'onChanged'> {
  /**
   * Value applying to the target element when isDark=true
   *
   * @default 'dark'
   */
  valueDark?: string

  /**
   * Value applying to the target element when isDark=false
   *
   * @default ''
   */
  valueLight?: string

  /**
   * A custom handler for handle the updates.
   * When specified, the default behavior will be overridden.
   *
   * @default undefined
   */
  onChanged?: (isDark: boolean) => void
}

/**
 * Reactive dark mode with auto data persistence.
 *
 * @see https://vueuse.org/useDark
 * @param options
 */
export function useDark(options: UseDarkOptions = {}) {
  const {
    valueDark = 'dark',
    valueLight = '',
    window = defaultWindow,
  } = options

  const mode = useColorMode({
    ...options,
    onChanged: (mode, defaultHandler) => {
      if (options.onChanged)
        options.onChanged?.(mode === 'dark')
      else
        defaultHandler(mode)
    },
    modes: {
      dark: valueDark,
      light: valueLight,
    },
  })

  const preferredDark = usePreferredDark({ window })

  const isDark = computed<boolean>({
    get() {
      return mode.value === 'dark'
    },
    set(v) {
      if (v === preferredDark.value)
        mode.value = 'auto'
      else
        mode.value = v ? 'dark' : 'light'
    },
  })

  return isDark
}
