import { computed, ref, watch } from 'vue-demi'
import { StorageLike, useStorage } from '../useStorage'
import { ConfigurableWindow, defaultWindow } from '../_configurable'
import { usePreferredDark } from '../usePreferredDark'
import { tryOnMounted } from '../dist'

export interface UseDarkOptions extends ConfigurableWindow {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string

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
   * @default ''
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
   * Key to persist the data into localStorage/sessionStorage.
   *
   * Pass `null` to disable persistence
   *
   * @default 'vueuse-color-scheme'
   */
  storageKey?: string | null

  /**
   * Storage object, can be localStorage or sessionStorage
   *
   * @default localStorage
   */
  storage?: StorageLike
}

export type ColorSchemes = 'light' | 'dark' | 'auto'

/**
 * Reactive dark mode with auto data persistence.
 *
 * @see   {@link https://vueuse.js.org/useDark}
 * @param options
 */
export function useDark(options: UseDarkOptions = {}) {
  const {
    selector = 'html',
    attribute = 'class',
    valueDark = 'dark',
    valueLight = '',
    window = defaultWindow,
    storage = defaultWindow?.localStorage,
    storageKey = 'vueuse-color-scheme',
  } = options

  const preferredDark = usePreferredDark({ window })
  const store = storageKey == null
    ? ref<ColorSchemes>('auto')
    : useStorage<ColorSchemes>(storageKey, 'auto', storage)

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

  const isAuto = computed(() => store.value === 'auto')

  const onChanged = options.onChanged || ((v: boolean) => {
    const el = window?.document.querySelector(selector)
    if (attribute === 'class') {
      el?.classList.toggle(valueDark, v)
      if (valueLight)
        el?.classList.toggle(valueLight, !v)
    }
    else { el?.setAttribute(attribute, v ? valueDark : valueLight) }
  })

  watch(isDark, onChanged, { flush: 'post' })

  tryOnMounted(() => onChanged(isDark.value))

  return {
    isDark,
    isAuto,
  }
}
