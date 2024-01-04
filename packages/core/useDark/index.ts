import { computed } from 'vue-demi'
import { defaultWindow } from '../_configurable'
import { usePreferredDark } from '../usePreferredDark'
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
    window = defaultWindow,
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

  const system = computed(() => {
    if (mode.system) {
      return mode.system.value
    }
    else {
      // In Vue 2.6, ref not be extensible, mode.system is undefined
      const preferredDark = usePreferredDark({ window })
      return preferredDark.value ? 'dark' : 'light'
    }
  })

  const isDark = computed<boolean>({
    get() {
      return mode.value === 'dark'
    },
    set(v) {
      const modeVal = v ? 'dark' : 'light'
      if (system.value === modeVal)
        mode.value = 'auto'
      else
        mode.value = modeVal
    },
  })

  return isDark
}
