import type { Awaitable, ConfigurableEventFilter, ConfigurableFlush, RemovableRef } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { StorageLike } from '../ssr-handlers'
import { tryOnMounted, watchPausable } from '@vueuse/shared'
import { computed, ref as deepRef, nextTick, shallowRef, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { getSSRHandler } from '../ssr-handlers'
import { useEventListener } from '../useEventListener'
import { guessSerializerType } from './guess'

export interface Serializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}

export interface SerializerAsync<T> {
  read: (raw: string) => Awaitable<T>
  write: (value: T) => Awaitable<string>
}

export const StorageSerializers: Record<'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date', Serializer<any>> = {
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
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
}

export const customStorageEventName = 'vueuse-storage'

export interface StorageEventLike {
  storageArea: StorageLike<unknown> | null
  key: StorageEvent['key']
  oldValue: unknown
  newValue: unknown
}

export interface UseStorageOptions<T> extends ConfigurableEventFilter, ConfigurableWindow, ConfigurableFlush {
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
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean

  /**
   * Merge the default value with the value read from the storage.
   *
   * When setting it to true, it will perform a **shallow merge** for objects.
   * You can pass a function to perform custom merge (e.g. deep merge), for example:
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)

  /**
   * Custom data serialization.
   *
   * `false` can be passed to store values as-is without serialization.
   */
  serializer?: Serializer<T>

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

  /**
   * Wait for the component to be mounted before reading the storage.
   *
   * @default false
   */
  initOnMounted?: boolean
}

export interface UseStorageRawOptions<T> extends Omit<UseStorageOptions<T>, 'serializer'> {
  /**
   * Store values as-is without serialization.
   */
  serializer: false
}

export function useStorage<T>(key: MaybeRefOrGetter<string>, defaults: MaybeRefOrGetter<T>, storage: StorageLike<T>, options: UseStorageRawOptions<T>): RemovableRef<T>
export function useStorage(key: MaybeRefOrGetter<string>, defaults: MaybeRefOrGetter<string>, storage?: StorageLike, options?: UseStorageOptions<string>): RemovableRef<string>
export function useStorage(key: MaybeRefOrGetter<string>, defaults: MaybeRefOrGetter<boolean>, storage?: StorageLike, options?: UseStorageOptions<boolean>): RemovableRef<boolean>
export function useStorage(key: MaybeRefOrGetter<string>, defaults: MaybeRefOrGetter<number>, storage?: StorageLike, options?: UseStorageOptions<number>): RemovableRef<number>
export function useStorage<T>(key: MaybeRefOrGetter<string>, defaults: MaybeRefOrGetter<T>, storage?: StorageLike, options?: UseStorageOptions<T>): RemovableRef<T>
export function useStorage<T = unknown>(key: MaybeRefOrGetter<string>, defaults: MaybeRefOrGetter<null>, storage?: StorageLike<T>, options?: UseStorageOptions<T>): RemovableRef<T>
/**
 * Reactive LocalStorage/SessionStorage.
 *
 * @see https://vueuse.org/useStorage
 */
export function useStorage<T extends (string | number | boolean | object | null)>(
  key: MaybeRefOrGetter<string>,
  defaults: MaybeRefOrGetter<T>,
  storage: StorageLike<T> | StorageLike | undefined,
  options: UseStorageOptions<T> | UseStorageRawOptions<T> = {},
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e)
    },
    initOnMounted,
  } = options

  const data = (shallow ? shallowRef : deepRef)(typeof defaults === 'function' ? defaults() : defaults) as RemovableRef<T>
  const keyComputed = computed<string>(() => toValue(key))

  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorage', () => defaultWindow?.localStorage)()
    }
    catch (e) {
      onError(e)
    }
  }

  if (!storage)
    return data

  const rawInit: T = toValue(defaults)
  const type = guessSerializerType<T>(rawInit)
  const serializer = options.serializer ?? StorageSerializers[type]

  const readValue = (raw: any): T => serializer === false ? raw : serializer.read(raw)
  const writeValue = (value: T): any => serializer === false ? value : serializer.write(value)

  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
    data,
    newValue => write(newValue),
    { flush, deep, eventFilter },
  )

  watch(keyComputed, () => update(), { flush })

  let firstMounted = false
  const onStorageEvent = (ev: StorageEvent): void => {
    if (initOnMounted && !firstMounted) {
      return
    }

    update(ev)
  }
  const onStorageCustomEvent = (ev: CustomEvent<StorageEventLike>): void => {
    if (initOnMounted && !firstMounted) {
      return
    }

    updateFromCustomEvent(ev)
  }

  /**
   * The custom event is needed for same-document syncing when using custom
   * storage backends, but it doesn't work across different documents.
   *
   * TODO: Consider implementing a BroadcastChannel-based solution that fixes this.
   */
  if (window && listenToStorageChanges) {
    if (storage instanceof Storage)
      useEventListener(window, 'storage', onStorageEvent, { passive: true })
    else
      useEventListener(window, customStorageEventName, onStorageCustomEvent)
  }

  if (initOnMounted) {
    tryOnMounted(() => {
      firstMounted = true
      update()
    })
  }
  else {
    update()
  }

  function dispatchWriteEvent(oldValue: T | string | null, newValue: T | string | null) {
    // send custom event to communicate within same page
    if (window) {
      const payload = {
        key: keyComputed.value,
        oldValue,
        newValue,
        storageArea: storage as StorageLike<unknown>,
      }
      // We also use a CustomEvent since StorageEvent cannot
      // be constructed with a non-built-in storage area
      window.dispatchEvent(storage instanceof Storage
        ? new StorageEvent('storage', {
            key: payload.key,
            oldValue: payload.oldValue as string | null,
            newValue: payload.newValue as string | null,
            storageArea: storage,
          })
        : new CustomEvent<StorageEventLike>(customStorageEventName, {
            detail: payload,
          }))
    }
  }

  function write(v: unknown) {
    try {
      const oldValue = storage!.getItem(keyComputed.value)

      if (v == null) {
        dispatchWriteEvent(oldValue, null)
        storage!.removeItem(keyComputed.value)
      }
      else {
        const newValue = writeValue(v as T)
        if (oldValue !== newValue) {
          storage!.setItem(keyComputed.value, newValue)
          dispatchWriteEvent(oldValue, newValue)
        }
      }
    }
    catch (e) {
      onError(e)
    }
  }

  function read(event?: StorageEvent | StorageEventLike) {
    const rawValue = event
      ? event.newValue
      : storage!.getItem(keyComputed.value)

    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        storage!.setItem(keyComputed.value, writeValue(rawInit))
      return rawInit
    }
    else if (serializer === false) {
      return rawValue
    }
    else if (!event && mergeDefaults) {
      const value = readValue(rawValue)
      if (typeof mergeDefaults === 'function')
        return mergeDefaults(value, rawInit)
      else if (type === 'object' && !Array.isArray(value))
        return { ...(rawInit as any), ...(value as any) }
      return value
    }
    else if (typeof rawValue !== 'string') {
      return rawValue
    }
    else {
      return readValue(rawValue)
    }
  }

  function update(event?: StorageEvent | StorageEventLike) {
    if (event && event.storageArea !== storage)
      return

    if (event && event.key == null) {
      data.value = rawInit
      return
    }

    if (event && event.key !== keyComputed.value) {
      return
    }

    pauseWatch()

    try {
      const serializedData = writeValue(data.value)
      if (event === undefined || event?.newValue !== serializedData) {
        data.value = read(event)
      }
    }
    catch (e) {
      onError(e)
    }
    finally {
      // use nextTick to avoid infinite loop
      if (event)
        nextTick(resumeWatch)
      else
        resumeWatch()
    }
  }

  function updateFromCustomEvent(event: CustomEvent<StorageEventLike>) {
    update(event.detail)
  }

  return data
}
