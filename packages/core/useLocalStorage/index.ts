import { StorageOptions, useStorage } from '../useStorage'
import { Ref } from 'vue-demi'
import { defaultWindow } from '../_configurable'

export function useLocalStorage (key: string, defaultValue: string, options?: StorageOptions): Ref<string>
export function useLocalStorage (key: string, defaultValue: boolean, options?: StorageOptions): Ref<boolean>
export function useLocalStorage(key: string, defaultValue: number, options?: StorageOptions): Ref<number>
export function useLocalStorage<T> (key: string, defaultValue: T, options?: StorageOptions): Ref<T>
export function useLocalStorage<T = unknown> (key: string, defaultValue: null, options?: StorageOptions): Ref<T>

/**
 * Reactive LocalStorage.
 *
 * @see   {@link https://vueuse.js.org/useLocalStorage}
 * @param key
 * @param defaultValue
 * @param options
 */
export function useLocalStorage<T extends(string|number|boolean|object|null)> (key: string, defaultValue: T, options: StorageOptions = {}): Ref<any> {
  const { window = defaultWindow } = options
  return useStorage(key, defaultValue, window?.localStorage, options)
}
