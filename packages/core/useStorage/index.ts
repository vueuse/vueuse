import { ConfigurableFlush, watchWithFilter, ConfigurableEventFilter } from '@vueuse/shared'
import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

const Serializers = {
  boolean: {
    read: (v: any, d: any) => v != null ? v === 'true' : d,
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any, d: any) => v ? JSON.parse(v) : d,
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any, d: any) => v != null ? Number.parseFloat(v) : d,
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any, d: any) => v != null ? v : d,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any, d: any) => v != null ? v : d,
    write: (v: any) => String(v),
  },
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export interface StorageOptions extends ConfigurableEventFilter, ConfigurableWindow, ConfigurableFlush {
  /**
   * Watch for deep changes
   *
   * @default true
   */
  deep?: boolean

  /**
   * Listen to storage changes, useful for multiple tabs application
   *
   * @default true
   */
  listenToStorageChanges?: boolean
}

export function useStorage(key: string, defaultValue: string, storage?: StorageLike, options?: StorageOptions): Ref<string>
export function useStorage(key: string, defaultValue: boolean, storage?: StorageLike, options?: StorageOptions): Ref<boolean>
export function useStorage(key: string, defaultValue: number, storage?: StorageLike, options?: StorageOptions): Ref<number>
export function useStorage<T> (key: string, defaultValue: T, storage?: StorageLike, options?: StorageOptions): Ref<T>
export function useStorage<T = unknown> (key: string, defaultValue: null, storage?: StorageLike, options?: StorageOptions): Ref<T>

/**
 * Reactive LocalStorage/SessionStorage.
 *
 * @see   {@link https://vueuse.js.org/useStorage}
 * @param key
 * @param defaultValue
 * @param storage
 * @param options
 */
export function useStorage<T extends(string|number|boolean|object|null)> (
  key: string,
  defaultValue: T,
  storage: StorageLike | undefined = defaultWindow?.localStorage,
  options: StorageOptions = {},
) {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    window = defaultWindow,
    eventFilter,
  } = options

  const data = ref<T>(defaultValue)

  const type = defaultValue == null
    ? 'any'
    : typeof defaultValue === 'boolean'
      ? 'boolean'
      : typeof defaultValue === 'string'
        ? 'string'
        : typeof defaultValue === 'object'
          ? 'object'
          : Array.isArray(defaultValue)
            ? 'object'
            : !Number.isNaN(defaultValue)
              ? 'number'
              : 'any'

  function read() {
    if (!storage)
      return

    try {
      let rawValue = storage.getItem(key)
      if (rawValue == null && defaultValue) {
        rawValue = Serializers[type].write(defaultValue)
        storage.setItem(key, rawValue)
      }
      else {
        data.value = Serializers[type].read(rawValue, defaultValue)
      }
    }
    catch (e) {
      console.warn(e)
    }
  }

  read()

  if (window && listenToStorageChanges)
    useEventListener(window, 'storage', read)

  watchWithFilter(
    data,
    () => {
      if (!storage) // SSR
        return

      try {
        if (data.value == null)
          storage.removeItem(key)
        else
          storage.setItem(key, Serializers[type].write(data.value))
      }
      catch (e) {
        console.warn(e)
      }
    },
    {
      flush,
      deep,
      eventFilter,
    },
  )

  return data
}
