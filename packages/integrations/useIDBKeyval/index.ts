import type { ConfigurableFlush, MaybeComputedRef, RemovableRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref, shallowRef, watch } from 'vue-demi'
import { del, get, set, update } from 'idb-keyval'

export interface UseIDBOptions extends ConfigurableFlush {
  /**
   * Watch for deep changes
   *
   * @default true
   */
  deep?: boolean

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void

  /**
   * Use shallow ref as reference
   *
   * @default false
   */
  shallow?: boolean
}

/**
 *
 * @param key
 * @param initialValue
 * @param options
 */
export function useIDBKeyval<T>(
  key: IDBValidKey,
  initialValue: MaybeComputedRef<T>,
  options: UseIDBOptions = {},
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    shallow,
    onError = (e) => {
      console.error(e)
    },
  } = options

  const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>

  const rawInit: T = resolveUnref(initialValue)

  async function read() {
    try {
      const rawValue = await get<T>(key)
      if (rawValue === undefined) {
        if (rawInit)
          set(key, rawInit)
      }
      else {
        data.value = rawValue
      }
    }
    catch (e) {
      onError(e)
    }
  }

  read()

  async function write() {
    try {
      if (data.value == null) {
        await del(key)
      }
      else {
        // IndexedDB does not support saving proxies, convert from proxy before saving
        if (Array.isArray(data.value))
          await update(key, () => (JSON.parse(JSON.stringify(data.value))))
        else if (typeof data.value === 'object')
          await update(key, () => ({ ...data.value }))
        else
          await update(key, () => (data.value))
      }
    }
    catch (e) {
      onError(e)
    }
  }

  watch(data, () => write(), { flush, deep })

  return data as RemovableRef<T>
}
