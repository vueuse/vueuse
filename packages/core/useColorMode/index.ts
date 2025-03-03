import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { StorageLike } from '../ssr-handlers'
import type { MaybeElementRef } from '../unrefElement'
import type { UseStorageOptions } from '../useStorage'
import { toRef, tryOnMounted } from '@vueuse/shared'
import { computed, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { getSSRHandler } from '../ssr-handlers'
import { unrefElement } from '../unrefElement'
import { usePreferredDark } from '../usePreferredDark'
import { useStorage } from '../useStorage'

export type BasicColorMode = 'light' | 'dark'
export type BasicColorSchema = BasicColorMode | 'auto'

export interface UseColorModeOptions<T extends string = BasicColorMode> extends UseStorageOptions<T | BasicColorMode> {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string | MaybeElementRef

  /**
   * HTML attribute applying the target element
   *
   * @default 'class'
   */
  attribute?: string

  /**
   * The initial color mode
   *
   * @default 'auto'
   */
  initialValue?: MaybeRefOrGetter<T | BasicColorSchema>

  /**
   * Prefix when adding value to the attribute
   */
  modes?: Partial<Record<T | BasicColorSchema, string>>

  /**
   * A custom handler for handle the updates.
   * When specified, the default behavior will be overridden.
   *
   * @default undefined
   */
  onChanged?: (mode: T | BasicColorMode, defaultHandler:((mode: T | BasicColorMode) => void)) => void

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
   * @deprecated use `store.value` when `auto` mode needs to be known
   * @see https://vueuse.org/core/useColorMode/#advanced-usage
   */
  emitAuto?: boolean

  /**
   * Disable transition on switch
   *
   * @see https://paco.me/writing/disable-theme-transitions
   * @default true
   */
  disableTransition?: boolean
}

export type UseColorModeReturn<T extends string = BasicColorMode> =
  Ref<T | BasicColorSchema> & {
    store: Ref<T | BasicColorSchema>
    system: ComputedRef<BasicColorMode>
    state: ComputedRef<T | BasicColorMode>
  }

const CSS_DISABLE_TRANS = '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'

/**
 * Reactive color mode with auto data persistence.
 *
 * @see https://vueuse.org/useColorMode
 * @param options
 */
export function useColorMode<T extends string = BasicColorMode>(
  options: UseColorModeOptions<T> = {},
): UseColorModeReturn<T> {
  const {
    selector = 'html',
    attribute = 'class',
    initialValue = 'auto',
    window = defaultWindow,
    storage,
    storageKey = 'vueuse-color-scheme',
    listenToStorageChanges = true,
    storageRef,
    emitAuto,
    disableTransition = true,
  } = options

  const modes = {
    auto: '',
    light: 'light',
    dark: 'dark',
    ...options.modes || {},
  } as Record<BasicColorSchema | T, string>

  const preferredDark = usePreferredDark({ window })
  const system = computed(() => preferredDark.value ? 'dark' : 'light')

  const store = storageRef || (
    storageKey == null
      ? toRef(initialValue) as Ref<T | BasicColorSchema>
      : useStorage<T | BasicColorSchema>(storageKey, initialValue, storage, { window, listenToStorageChanges })
  )

  const state = computed<T | BasicColorMode>(() =>
    store.value === 'auto'
      ? system.value
      : store.value)

  const updateHTMLAttrs = getSSRHandler(
    'updateHTMLAttrs',
    (selector, attribute, value) => {
      const el = typeof selector === 'string'
        ? window?.document.querySelector(selector)
        : unrefElement(selector)
      if (!el)
        return

      const classesToAdd = new Set<string>()
      const classesToRemove = new Set<string>()
      let attributeToChange: { key: string, value: string } | null = null

      if (attribute === 'class') {
        const current = value.split(/\s/g)
        Object.values(modes)
          .flatMap(i => (i || '').split(/\s/g))
          .filter(Boolean)
          .forEach((v) => {
            if (current.includes(v))
              classesToAdd.add(v)
            else
              classesToRemove.add(v)
          })
      }
      else {
        attributeToChange = { key: attribute, value }
      }

      if (classesToAdd.size === 0 && classesToRemove.size === 0 && attributeToChange === null)
        // Nothing changed so we can avoid reflowing the page
        return

      let style: HTMLStyleElement | undefined
      if (disableTransition) {
        style = window!.document.createElement('style')
        style.appendChild(document.createTextNode(CSS_DISABLE_TRANS))
        window!.document.head.appendChild(style)
      }

      for (const c of classesToAdd) {
        el.classList.add(c)
      }
      for (const c of classesToRemove) {
        el.classList.remove(c)
      }
      if (attributeToChange) {
        el.setAttribute(attributeToChange.key, attributeToChange.value)
      }

      if (disableTransition) {
        // Calling getComputedStyle forces the browser to redraw
        // @ts-expect-error unused variable
        const _ = window!.getComputedStyle(style!).opacity
        document.head.removeChild(style!)
      }
    },
  )

  function defaultOnChanged(mode: T | BasicColorMode) {
    updateHTMLAttrs(selector, attribute, modes[mode] ?? mode)
  }

  function onChanged(mode: T | BasicColorMode) {
    if (options.onChanged)
      options.onChanged(mode, defaultOnChanged)
    else
      defaultOnChanged(mode)
  }

  watch(state, onChanged, { flush: 'post', immediate: true })

  tryOnMounted(() => onChanged(state.value))

  const auto = computed({
    get() {
      return emitAuto ? store.value : state.value
    },
    set(v) {
      store.value = v
    },
  })

  return Object.assign(auto, { store, system, state }) as UseColorModeReturn<T>
}
