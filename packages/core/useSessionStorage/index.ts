import { StorageOptions, useStorage } from '../useStorage'
import { Ref } from 'vue-demi'
import { defaultWindow } from '../_configurable'

export function useSessionStorage (key: string, defaultValue: string, options?: StorageOptions): Ref<string>
export function useSessionStorage (key: string, defaultValue: boolean, options?: StorageOptions): Ref<boolean>
export function useSessionStorage(key: string, defaultValue: number, options?: StorageOptions): Ref<number>
export function useSessionStorage<T> (key: string, defaultValue: T, options?: StorageOptions): Ref<T>
export function useSessionStorage<T = unknown> (key: string, defaultValue: null, options?: StorageOptions): Ref<T>

/**
 * Reactive SessionStorage.
 *
 * @see https://vueuse.org/useSessionStorage
 * @param key
 * @param defaultValue
 * @param options
 */
export function useSessionStorage<T extends(string|number|boolean|object|null)> (key: string, defaultValue: T, options: StorageOptions = {}): Ref<any> {
  const { window = defaultWindow } = options
  return useStorage(key, defaultValue, window?.sessionStorage, options)
}
