import type { RemovableRef } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { StorageLike } from '../ssr-handlers'
import type { UseStorageOptions } from '../useStorage'
import { defaultWindow } from '../_configurable'
import { useStorage } from '../useStorage'

export function useLocalStorage(key: MaybeRefOrGetter<string>, initialValue: MaybeRefOrGetter<string>, options?: UseStorageOptions<string>): RemovableRef<string>
export function useLocalStorage(key: MaybeRefOrGetter<string>, initialValue: MaybeRefOrGetter<boolean>, options?: UseStorageOptions<boolean>): RemovableRef<boolean>
export function useLocalStorage(key: MaybeRefOrGetter<string>, initialValue: MaybeRefOrGetter<number>, options?: UseStorageOptions<number>): RemovableRef<number>
export function useLocalStorage<T>(key: MaybeRefOrGetter<string>, initialValue: MaybeRefOrGetter<T>, options?: UseStorageOptions<T>): RemovableRef<T>
export function useLocalStorage<T = unknown>(key: MaybeRefOrGetter<string>, initialValue: MaybeRefOrGetter<null>, options?: UseStorageOptions<T>): RemovableRef<T>

/**
 * Reactive LocalStorage.
 *
 * @see https://vueuse.org/useLocalStorage
 * @param key
 * @param initialValue
 * @param options
 */
export function useLocalStorage<T extends(string | number | boolean | object | null)>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<any> {
  const { window = defaultWindow, onError = (error: unknown) => console.error(error) } = options
  let storage: StorageLike | undefined
  try {
    storage = window?.localStorage
  }
  catch (error) {
    // Reading `localStorage` throws a `SecurityError` when site data is blocked.
    // Report it and keep the ref usable with a storage that drops every write.
    onError(error)
    storage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
  return useStorage(key, initialValue, storage, options)
}
