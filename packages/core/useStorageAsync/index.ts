import { watchWithFilter, MaybeRef, RemovableRef } from '@vueuse/shared'
import { ref, Ref, unref, shallowRef } from 'vue-demi'
import { SerializerAsync, StorageLikeAsync, StorageOptions, StorageSerializers } from '../useStorage'
import { useEventListener } from '../useEventListener'
import { guessSerializerType } from '../useStorage/guess'
import { defaultWindow } from '../_configurable'

export interface StorageAsyncOptions<T> extends Omit<StorageOptions<T>, 'serializer'> {
  /**
   * Custom data serialization
   */
  serializer?: SerializerAsync<T>
}

export function useStorageAsync(key: string, initialValue: MaybeRef<string>, storage?: StorageLikeAsync, options?: StorageAsyncOptions<string>): RemovableRef<string>
export function useStorageAsync(key: string, initialValue: MaybeRef<boolean>, storage?: StorageLikeAsync, options?: StorageAsyncOptions<boolean>): RemovableRef<boolean>
export function useStorageAsync(key: string, initialValue: MaybeRef<number>, storage?: StorageLikeAsync, options?: StorageAsyncOptions<number>): RemovableRef<number>
export function useStorageAsync<T> (key: string, initialValue: MaybeRef<T>, storage?: StorageLikeAsync, options?: StorageAsyncOptions<T>): RemovableRef<T>
export function useStorageAsync<T = unknown> (key: string, initialValue: MaybeRef<null>, storage?: StorageLikeAsync, options?: StorageAsyncOptions<T>): RemovableRef<T>

/**
 * Reactive Storage in with async support.
 *
 * @see https://vueuse.org/useStorageAsync
 * @param key
 * @param initialValue
 * @param storage
 * @param options
 */
export function useStorageAsync<T extends(string|number|boolean|object|null)> (
  key: string,
  initialValue: MaybeRef<T>,
  storage: StorageLikeAsync | undefined = defaultWindow?.localStorage,
  options: StorageAsyncOptions<T> = {},
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    window = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e)
    },
  } = options

  const rawInit: T = unref(initialValue)
  const type = guessSerializerType<T>(rawInit)

  const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>
  const serializer = options.serializer ?? StorageSerializers[type]

  async function read(event?: StorageEvent) {
    if (!storage || (event && event.key !== key))
      return

    try {
      const rawValue = event ? event.newValue : await storage.getItem(key)
      if (rawValue == null) {
        data.value = rawInit
        if (writeDefaults && rawInit !== null)
          await storage.setItem(key, await serializer.write(rawInit))
      }
      else {
        data.value = await serializer.read(rawValue)
      }
    }
    catch (e) {
      onError(e)
    }
  }

  read()

  if (window && listenToStorageChanges)
    useEventListener(window, 'storage', e => setTimeout(() => read(e), 0))

  if (storage) {
    watchWithFilter(
      data,
      async() => {
        try {
          if (data.value == null)
            await storage.removeItem(key)
          else
            await storage.setItem(key, await serializer.write(data.value))
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

  return data as RemovableRef<T>
}
