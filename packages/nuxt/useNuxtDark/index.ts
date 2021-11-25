import { ColorSchema, usePreferredDark, ConfigurableWindow, defaultWindow } from '@vueuse/core'
import { computed } from 'vue-demi'
// @ts-expect-error
import { useCookie, useMeta } from '#app'

export interface UseNuxtDarkOptions extends ConfigurableWindow {
  /**
   * HTML attribute applying the target element
   *
   * @default 'class'
   */
  attribute?: string

  /**
   * Value applying to the target element when isDark=true
   *
   * @default 'dark'
   */
  valueDark?: string

  /**
   * Value applying to the target element when isDark=false
   *
   * @default 'light'
   */
  valueLight?: string

  /**
   * A custom handler for handle the updates.
   * When specified, the default behavior will be overridded.
   *
   * @default undefined
   */
  onChanged?: (isDark: boolean) => void

  /**
   * Key to persist the data into Nuxt's useCookie.
   *
   * Pass `null` to disable persistence
   *
   * @default 'vueuse-color-schema'
   */
  cookieKey?: string
}

/**
 * Reactive dark mode with auto data persistence for Nuxt.
 *
 * @see https://vueuse.org/useNuxtDark
 * @param options
 */
export function useNuxtDark(options: UseNuxtDarkOptions = {}) {
  const {
    attribute = 'class',
    valueDark = 'dark',
    valueLight = 'light',
    window = defaultWindow,
    cookieKey = 'vueuse-color-schema',
  } = options

  const preferredDark = usePreferredDark({ window })
  const store = useCookie<ColorSchema>(cookieKey)

  if (store.value == null)
    store.value = 'auto'

  const isDark = computed<boolean>({
    get() {
      return store.value === 'auto'
        ? preferredDark.value
        : store.value === 'dark'
    },
    set(v) {
      if (v === preferredDark.value)
        store.value = 'auto'
      else
        store.value = v ? 'dark' : 'light'
    },
  })

  useMeta(computed(() => ({
    htmlAttrs: {
      [attribute]: isDark.value ? valueDark : valueLight,
    },
  })))

  return isDark
}
