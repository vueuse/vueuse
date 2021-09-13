import { MaybeRef, RemoveableRef } from '@vueuse/shared'
import { StorageOptions, useStorage } from '../useStorage'
import { defaultWindow } from '../_configurable'

export function useSessionStorage (key: string, initialValue: MaybeRef<string>, options?: StorageOptions<string>): RemoveableRef<string>
export function useSessionStorage (key: string, initialValue: MaybeRef<boolean>, options?: StorageOptions<boolean>): RemoveableRef<boolean>
export function useSessionStorage(key: string, initialValue: MaybeRef<number>, options?: StorageOptions<number>): RemoveableRef<number>
export function useSessionStorage<T> (key: string, initialValue: MaybeRef<T>, options?: StorageOptions<T>): RemoveableRef<T>
export function useSessionStorage<T = unknown> (key: string, initialValue: MaybeRef<null>, options?: StorageOptions<T>): RemoveableRef<T>

/**
 * Reactive SessionStorage.
 *
 * @see https://vueuse.org/useSessionStorage
 * @param key
 * @param initialValue
 * @param options
 */
export function useSessionStorage<T extends(string|number|boolean|object|null)> (
  key: string,
  initialValue: MaybeRef<T>,
  options: StorageOptions<T> = {},
): RemoveableRef<any> {
  const { window = defaultWindow } = options
  return useStorage(key, initialValue, window?.sessionStorage, options)
}
