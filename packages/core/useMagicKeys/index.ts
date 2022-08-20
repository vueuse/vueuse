import type { ComputedRef, Ref } from 'vue-demi'
import { computed, reactive, ref, unref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { noop, useTimeoutFn } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { defaultWindow } from '../_configurable'
import { useManualRefHistory } from '../useManualRefHistory'
import { DefaultMagicKeysAliasMap } from './aliasMap'

export interface UseMagicKeysOptions<Reactive extends Boolean> {
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
  target?: MaybeComputedRef<EventTarget>

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
   * Length of pressed keys history
   *
   * @default 5
   */
  historyLength?: number

  /**
   * Clear history after timeout
   *
   * @default 5000
   */
  historyClearTimeout?: number

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

export type UseMagicKeysReturn<Reactive extends Boolean> =
  Readonly<
  Omit<Reactive extends true
    ? Record<string, boolean>
    : Record<string, ComputedRef<boolean>>,
  keyof MagicKeysInternal>
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
    historyLength = 5,
    historyClearTimeout = 5000,
    onEventFired = noop,
  } = options
  const current = reactive(new Set<string>())
  const obj = { toJSON() { return {} }, current }
  const refs: Record<string, any> = useReactive ? reactive(obj) : obj
  const metaDeps = new Set<string>()
  const usedKeys = new Set<string>()
  const lastKey: Ref<string[]> = ref([])
  const {
    history,
    commit: saveHistory,
    clear: clearHistory,
    last: lastHistoryValue,
  } = useManualRefHistory(lastKey, { capacity: historyLength, clone: true })
  const {
    start: startHistoryTimeout,
    stop: stopHistoryTimeout,
  } = useTimeoutFn(() => {
    clearHistory()
    lastHistoryValue.value = { snapshot: [], timestamp: Date.now() }
  }, historyClearTimeout, { immediate: false })

  function setRefs(key: string, value: boolean) {
    if (key in refs) {
      if (useReactive)
        refs[key] = value
      else
        refs[key].value = value
    }
  }

  function reset() {
    for (const key of usedKeys)
      setRefs(key, false)
  }

  function addHistoryRecord(values: string[]) {
    stopHistoryTimeout()
    lastKey.value = values
    saveHistory()
    startHistoryTimeout()
  }

  function updateRefs(e: KeyboardEvent, value: boolean) {
    const key = e.key?.toLowerCase()
    const code = e.code?.toLowerCase()
    const values = [code, key].filter(Boolean)
    value && addHistoryRecord(values)

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
  useEventListener('blur', reset, { passive: true })
  useEventListener('focus', reset, { passive: true })

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
            refs[prop] = computed(() => keys.every(key => unref(proxy[key])))
          }
          else if (/>/.test(prop)) {
            const sequence = prop.split(/>/g).map(i => i.trim()).reverse()
            const snapshots = computed(() => unref(history).map(entry => entry.snapshot))
            refs[prop] = computed(() => sequence.every((key, i) => unref(snapshots)[i].includes(key)))
          }
          else {
            refs[prop] = ref(false)
          }
        }
        const r = Reflect.get(target, prop, rec)
        return useReactive ? unref(r) : r
      },
    },
  )

  return proxy as any
}

export { DefaultMagicKeysAliasMap } from './aliasMap'
