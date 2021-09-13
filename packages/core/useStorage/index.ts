import { ConfigurableFlush, watchWithFilter, ConfigurableEventFilter, MaybeRef, RemoveableRef } from '@vueuse/shared'
import { ref, Ref, unref } from 'vue-demi'
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

export function useStorage(key: string, initialValue: MaybeRef<string>, storage?: StorageLike, options?: StorageOptions<string>): RemoveableRef<string>
export function useStorage(key: string, initialValue: MaybeRef<boolean>, storage?: StorageLike, options?: StorageOptions<boolean>): RemoveableRef<boolean>
export function useStorage(key: string, initialValue: MaybeRef<number>, storage?: StorageLike, options?: StorageOptions<number>): RemoveableRef<number>
export function useStorage<T> (key: string, initialValue: MaybeRef<T>, storage?: StorageLike, options?: StorageOptions<T>): RemoveableRef<T>
export function useStorage<T = unknown> (key: string, initialValue: MaybeRef<null>, storage?: StorageLike, options?: StorageOptions<T>): RemoveableRef<T>

/**
 * Reactive LocalStorage/SessionStorage.
 *
 * @see https://vueuse.org/useStorage
 * @param key
 * @param initialValue
 * @param storage
 * @param options
 */
export function useStorage<T extends(string|number|boolean|object|null)> (
  key: string,
  initialValue: MaybeRef<T>,
  storage: StorageLike | undefined = defaultWindow?.localStorage,
  options: StorageOptions<T> = {},
): RemoveableRef<T> {
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

  const rawInit: T = unref(initialValue)

  const type = rawInit == null
    ? 'any'
    : typeof rawInit === 'boolean'
      ? 'boolean'
      : typeof rawInit === 'string'
        ? 'string'
        : typeof rawInit === 'object'
          ? 'object'
          : Array.isArray(rawInit)
            ? 'object'
            : !Number.isNaN(rawInit)
              ? 'number'
              : 'any'

  const data = ref(initialValue) as Ref<T>
  const serializer = options.serializer ?? StorageSerializers[type]

  function read(event?: StorageEvent) {
    if (!storage || (event && event.key !== key))
      return

    try {
      const rawValue = event ? event.newValue : storage.getItem(key)
      if (rawValue == null) {
        data.value = rawInit
        if (rawInit !== null)
          storage.setItem(key, serializer.write(rawInit))
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

  if (storage) {
    watchWithFilter(
      data,
      () => {
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
  }

  return data as RemoveableRef<T>
}
