import { computed } from 'vue-demi'
import { useColorMode } from '../useColorMode'
import type { BasicColorSchema, UseColorModeOptions } from '../useColorMode'

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
  onChanged?: (isDark: boolean, defaultHandler: ((mode: BasicColorSchema) => void), mode: BasicColorSchema) => void
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
  } = options

  const mode = useColorMode({
    ...options,
    onChanged: (mode, defaultHandler) => {
      if (options.onChanged)
        options.onChanged?.(mode === 'dark', defaultHandler, mode)
      else
        defaultHandler(mode)
    },
    modes: {
      dark: valueDark,
      light: valueLight,
    },
  })

  const isDark = computed<boolean>({
    get() {
      return mode.value === 'dark'
    },
    set(v) {
      const modeVal = v ? 'dark' : 'light'
      if (mode.system.value === modeVal)
        mode.value = 'auto'
      else
        mode.value = modeVal
    },
  })

  return isDark
}
