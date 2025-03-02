import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { noop } from '@vueuse/shared'
import { computed, reactive, shallowRef, toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { DefaultMagicKeysAliasMap } from './aliasMap'

export interface UseMagicKeysOptions<Reactive extends boolean> {
  /**
   * Returns a reactive object instead of an object of refs
   *
   * @default false
   */
  reactive?: Reactive

  /**
   * Target for listening events
   *
   * @default window
   */
  target?: MaybeRefOrGetter<EventTarget>

  /**
   * Alias map for keys, all the keys should be lowercase
   * { target: keycode }
   *
   * @example { ctrl: "control" }
   * @default <predefined-map>
   */
  aliasMap?: Record<string, string>

  /**
   * Register passive listener
   *
   * @default true
   */
  passive?: boolean

  /**
   * Custom event handler for keydown/keyup event.
   * Useful when you want to apply custom logic.
   *
   * When using `e.preventDefault()`, you will need to pass `passive: false` to useMagicKeys().
   */
  onEventFired?: (e: KeyboardEvent) => void | boolean
}

export interface MagicKeysInternal {
  /**
   * A Set of currently pressed keys,
   * Stores raw keyCodes.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
   */
  current: Set<string>
}

export type UseMagicKeysReturn<Reactive extends boolean> =
  Readonly<
    Omit<Reactive extends true
      ? Record<string, boolean>
      : Record<string, ComputedRef<boolean>>, keyof MagicKeysInternal>
      & MagicKeysInternal
  >

/**
 * Reactive keys pressed state, with magical keys combination support.
 *
 * @see https://vueuse.org/useMagicKeys
 */
export function useMagicKeys(options?: UseMagicKeysOptions<false>): UseMagicKeysReturn<false>
export function useMagicKeys(options: UseMagicKeysOptions<true>): UseMagicKeysReturn<true>
export function useMagicKeys(options: UseMagicKeysOptions<boolean> = {}): any {
  const {
    reactive: useReactive = false,
    target = defaultWindow,
    aliasMap = DefaultMagicKeysAliasMap,
    passive = true,
    onEventFired = noop,
  } = options
  const current = reactive(new Set<string>())
  const obj = {
    toJSON() { return {} },
    current,
  }
  const refs: Record<string, any> = useReactive ? reactive(obj) : obj
  const metaDeps = new Set<string>()
  const usedKeys = new Set<string>()

  function setRefs(key: string, value: boolean) {
    if (key in refs) {
      if (useReactive)
        refs[key] = value
      else
        refs[key].value = value
    }
  }

  function reset() {
    current.clear()
    for (const key of usedKeys)
      setRefs(key, false)
  }

  function updateRefs(e: KeyboardEvent, value: boolean) {
    const key = e.key?.toLowerCase()
    const code = e.code?.toLowerCase()
    const values = [code, key].filter(Boolean)

    // current set
    if (key) {
      if (value)
        current.add(key)
      else
        current.delete(key)
    }

    for (const key of values) {
      usedKeys.add(key)
      setRefs(key, value)
    }

    // #1312
    // In macOS, keys won't trigger "keyup" event when Meta key is released
    // We track it's combination and release manually
    if (key === 'meta' && !value) {
      // Meta key released
      metaDeps.forEach((key) => {
        current.delete(key)
        setRefs(key, false)
      })
      metaDeps.clear()
    }
    else if (typeof e.getModifierState === 'function' && e.getModifierState('Meta') && value) {
      [...current, ...values].forEach(key => metaDeps.add(key))
    }
  }

  useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    updateRefs(e, true)
    return onEventFired(e)
  }, { passive })
  useEventListener(target, 'keyup', (e: KeyboardEvent) => {
    updateRefs(e, false)
    return onEventFired(e)
  }, { passive })

  // #1350
  useEventListener('blur', reset, { passive })
  useEventListener('focus', reset, { passive })

  const proxy = new Proxy(
    refs,
    {
      get(target, prop, rec) {
        if (typeof prop !== 'string')
          return Reflect.get(target, prop, rec)

        prop = prop.toLowerCase()
        // alias
        if (prop in aliasMap)
          prop = aliasMap[prop]
        // create new tracking
        if (!(prop in refs)) {
          if (/[+_-]/.test(prop)) {
            const keys = prop.split(/[+_-]/g).map(i => i.trim())
            refs[prop] = computed(() => keys.map(key => toValue(proxy[key])).every(Boolean))
          }
          else {
            refs[prop] = shallowRef(false)
          }
        }
        const r = Reflect.get(target, prop, rec)
        return useReactive ? toValue(r) : r
      },
    },
  )

  return proxy as any
}

export { DefaultMagicKeysAliasMap } from './aliasMap'
