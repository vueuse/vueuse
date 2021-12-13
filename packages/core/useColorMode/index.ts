import { computed, Ref, ref, watch } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'
import { StorageLike, StorageOptions, useStorage } from '../useStorage'
import { defaultWindow } from '../_configurable'
import { usePreferredDark } from '../usePreferredDark'

export type BasicColorSchema = 'light' | 'dark' | 'auto'

export interface UseColorModeOptions<T extends string = BasicColorSchema> extends StorageOptions<T | BasicColorSchema> {
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
   * Prefix when adding value to the attribute
   */
  modes?: Partial<Record<T | BasicColorSchema, string>>

  /**
   * A custom handler for handle the updates.
   * When specified, the default behavior will be overridded.
   *
   * @default undefined
   */
  onChanged?: (mode: T | BasicColorSchema) => void

  /**
   * Custom storage ref
   *
   * When provided, `useStorage` will be skipped
   */
  storageRef?: Ref<T | BasicColorSchema>

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

/**
 * Reactive color mode with auto data persistence.
 *
 * @see https://vueuse.org/useColorMode
 * @param options
 */
export function useColorMode<T extends string = BasicColorSchema>(options: UseColorModeOptions<T> = {}) {
  const {
    selector = 'html',
    attribute = 'class',
    window = defaultWindow,
    storage = defaultWindow?.localStorage,
    storageKey = 'vueuse-color-scheme',
    listenToStorageChanges = true,
    storageRef,
  } = options

  const modes = {
    auto: '',
    light: 'light',
    dark: 'dark',
    ...options.modes || {},
  } as Record<BasicColorSchema | T, string>

  const preferredDark = usePreferredDark({ window })
  const preferredMode = computed(() => preferredDark.value ? 'dark' : 'light')

  const store = storageRef || (storageKey == null
    ? ref('auto') as Ref<T | BasicColorSchema>
    : useStorage<T | BasicColorSchema>(storageKey, 'auto', storage, { window, listenToStorageChanges }))

  const state = computed<T | BasicColorSchema>({
    get() {
      return store.value === 'auto'
        ? preferredMode.value
        : store.value
    },
    set(v) {
      if (preferredMode.value === v || v === 'auto')
        store.value = 'auto'
      else
        store.value = v
    },
  })

  const onChanged = options.onChanged || ((value: T | BasicColorSchema) => {
    const el = window?.document.querySelector(selector)
    if (!el)
      return

    if (attribute === 'class') {
      const current = (modes[value] || '').split(/\s/g)
      Object.values(modes)
        .flatMap(i => (i || '').split(/\s/g))
        .filter(Boolean)
        .forEach((v) => {
          if (current.includes(v))
            el.classList.add(v)
          else
            el.classList.remove(v)
        })
    }
    else {
      el.setAttribute(attribute, value)
    }
  })

  watch(state, onChanged, { flush: 'post' })

  tryOnMounted(() => onChanged(state.value))

  return state
}
