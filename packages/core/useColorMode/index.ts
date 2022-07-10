import type { Ref } from 'vue-demi'
import { computed, ref, watch } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'
import type { StorageLike } from '../ssr-handlers'
import { getSSRHandler } from '../ssr-handlers'
import type { UseStorageOptions } from '../useStorage'
import { useStorage } from '../useStorage'
import { defaultWindow } from '../_configurable'
import { usePreferredDark } from '../usePreferredDark'

export type BasicColorSchema = 'light' | 'dark' | 'auto'

export interface UseColorModeOptions<T extends string = BasicColorSchema> extends UseStorageOptions<T | BasicColorSchema> {
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
  onChanged?: (mode: T | BasicColorSchema, defaultHandler:((mode: T | BasicColorSchema) => void)) => void

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

  /**
   * Emit `auto` mode from state
   *
   * When set to `true`, preferred mode won't be translated into `light` or `dark`.
   * This is useful when the fact that `auto` mode was selected needs to be known.
   *
   * @default undefined
   */
  emitAuto?: boolean
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
    storage,
    storageKey = 'vueuse-color-scheme',
    listenToStorageChanges = true,
    storageRef,
    emitAuto,
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
      return store.value === 'auto' && !emitAuto
        ? preferredMode.value
        : store.value
    },
    set(v) {
      store.value = v
    },
  })

  const updateHTMLAttrs = getSSRHandler(
    'updateHTMLAttrs',
    (selector, attribute, value) => {
      const el = window?.document.querySelector(selector)
      if (!el)
        return

      if (attribute === 'class') {
        const current = value.split(/\s/g)
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

  function defaultOnChanged(mode: T | BasicColorSchema) {
    const resolvedMode = mode === 'auto' ? preferredMode.value : mode
    updateHTMLAttrs(selector, attribute, modes[resolvedMode] ?? resolvedMode)
  }

  function onChanged(mode: T | BasicColorSchema) {
    if (options.onChanged)
      options.onChanged(mode, defaultOnChanged)
    else
      defaultOnChanged(mode)
  }

  watch(state, onChanged, { flush: 'post', immediate: true })

  tryOnMounted(() => onChanged(state.value))

  return state
}
