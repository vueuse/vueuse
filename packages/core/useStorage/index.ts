import { ConfigurableFlush, watchWithFilter, ConfigurableEventFilter } from '@vueuse/shared'
import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export type Serializer<T> = {
  read(raw: string): T

  write(value: T): string
}

export const StorageSerializers: Record<'boolean' | 'object' | 'number' | 'any' | 'string', Serializer<any>> = {
  boolean: {
    read: (v: any) => v === 'true',
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export interface StorageOptions<T> extends ConfigurableEventFilter, ConfigurableWindow, ConfigurableFlush {
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

  /**
   * Custom data serialization
   */
  serializer?: Serializer<T>

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void
}

export function useStorage(key: string, defaultValue: string, storage?: StorageLike, options?: StorageOptions<string>): Ref<string>
export function useStorage(key: string, defaultValue: boolean, storage?: StorageLike, options?: StorageOptions<boolean>): Ref<boolean>
export function useStorage(key: string, defaultValue: number, storage?: StorageLike, options?: StorageOptions<number>): Ref<number>
export function useStorage<T> (key: string, defaultValue: T, storage?: StorageLike, options?: StorageOptions<T>): Ref<T>
export function useStorage<T = unknown> (key: string, defaultValue: null, storage?: StorageLike, options?: StorageOptions<T>): Ref<T>

/**
 * Reactive LocalStorage/SessionStorage.
 *
 * @see https://vueuse.org/useStorage
 * @param key
 * @param defaultValue
 * @param storage
 * @param options
 */
export function useStorage<T extends(string|number|boolean|object|null)> (
  key: string,
  defaultValue: T,
  storage: StorageLike | undefined = defaultWindow?.localStorage,
  options: StorageOptions<T> = {},
) {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    window = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e)
    },
  } = options

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

  const data = ref<T>(defaultValue)
  const serializer = options.serializer ?? StorageSerializers[type]

  function read(event?: StorageEvent) {
    if (!storage || (event && event.key !== key))
      return

    try {
      const rawValue = event ? event.newValue : storage.getItem(key)
      if (rawValue == null) {
        (data as Ref<T>).value = defaultValue
        if (defaultValue !== null)
          storage.setItem(key, serializer.write(defaultValue))
      }
      else {
        data.value = serializer.read(rawValue)
      }
    }
    catch (e) {
      onError(e)
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
          storage.setItem(key, serializer.write(data.value))
      }
      catch (e) {
        onError(e)
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
