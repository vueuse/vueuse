import { computed, ComputedRef, reactive, ref, unref } from 'vue-demi'
import { MaybeRef, noop } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { defaultWindow } from '../_configurable'
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
  target?: MaybeRef<EventTarget>

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
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
   */
  current: Set<string>
}

export type MagicKeys<Reactive extends Boolean> =
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
export function useMagicKeys(options?: UseMagicKeysOptions<false>): MagicKeys<false>
export function useMagicKeys(options: UseMagicKeysOptions<true>): MagicKeys<true>
export function useMagicKeys(options: UseMagicKeysOptions<boolean> = {}): any {
  const {
    reactive: useReactive = false,
    target = defaultWindow,
    aliasMap = DefaultMagicKeysAliasMap,
    passive = true,
    onEventFired = noop,
  } = options
  const current = reactive(new Set<string>())
  const obj = { toJSON() { return {} }, current }
  const refs: Record<string, any> = useReactive ? reactive(obj) : obj

  function safeSetRef(key: string, value: boolean) {
    if (key in refs) {
      if (refs[key] === value)
        return

      if (useReactive)
        refs[key] = value

      else
        refs[key].value = value
    }
  }

  function forceUpdateMetaDependents() {
    const metaAliases = Object.entries(aliasMap).map(([key, value]) => {
      if (value === 'meta')
        return key

      return ''
    }).filter(k => k !== '')

    const metaDeps = Object.keys(refs).map((k) => {
      let key = ''
      for (let idx = 0; idx < metaAliases.length; idx++) {
        const alias = metaAliases[idx]
        if (k.includes(alias))
          key = k.replace(alias, '').replace(/[+_-]/g, '')
      }
      return key
    }).filter(k => k !== '')

    // set all the deps to false
    metaDeps.forEach((k) => {
      safeSetRef(k, false)
    })

    // clear from current set
    for (const k of current.keys()) {
      if (metaDeps.includes(k.toLowerCase()))
        current.delete(k)
    }
  }

  function updateRefs(e: KeyboardEvent, value: boolean) {
    const key = e.key.toLowerCase()
    const code = e.code.toLowerCase()
    const values = [code, key]

    // current set
    if (value) { current.add(e.code) }
    else {
      current.delete(e.code)
      if (key === 'meta')
        forceUpdateMetaDependents()
    }

    for (const key of values)
      safeSetRef(key, value)
  }

  if (target) {
    useEventListener(target, 'keydown', (e: KeyboardEvent) => {
      updateRefs(e, true)
      return onEventFired(e)
    }, { passive })
    useEventListener(target, 'keyup', (e: KeyboardEvent) => {
      updateRefs(e, false)
      return onEventFired(e)
    }, { passive })
  }

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
