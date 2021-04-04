import { computed, ComputedRef, reactive, ref, unref } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { defaultWindow } from '../_configurable'

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
}

/**
 * Reactive keys pressed state, with magical keys combination support.
 *
 * @link https://vueuse.org/useMagicKeys
 */
export function useMagicKeys(options?: UseMagicKeysOptions<false>): Readonly<Record<string, ComputedRef<boolean>>>
export function useMagicKeys(options: UseMagicKeysOptions<true>): Readonly<Record<string, boolean>>
export function useMagicKeys(options: UseMagicKeysOptions<boolean> = {}): any {
  const {
    reactive: useReactive = false,
    target = defaultWindow,
  } = options
  const obj = { toJSON() { return {} } }
  const refs: Record<string, any> = useReactive ? reactive(obj) : obj

  function updateRefs(e: KeyboardEvent, value: boolean) {
    const values = [e.code.toLowerCase(), e.key.toLowerCase()]
    for (const key of values) {
      if (key in refs) {
        if (useReactive)
          refs[key] = value
        else
          refs[key].value = value
      }
    }
  }

  if (target) {
    useEventListener(target, 'keydown', (e: KeyboardEvent) => updateRefs(e, true), { passive: true })
    useEventListener(target, 'keyup', (e: KeyboardEvent) => updateRefs(e, false), { passive: true })
  }

  const proxy = new Proxy(
    refs,
    {
      get(target, prop, rec) {
        if (typeof prop !== 'string')
          return Reflect.get(target, prop, rec)

        prop = prop.toLowerCase()
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
