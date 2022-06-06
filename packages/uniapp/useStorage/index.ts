import type { MaybeRef, RemovableRef } from '@vueuse/shared'
import type { StorageOptions } from '../../core/useStorage'
import { useStorage as useStorageBase } from '../../core/useStorage'

export function useStorage(uni: any, key: string, initialValue: MaybeRef<string>, options?: StorageOptions<string>): RemovableRef<string>
export function useStorage(uni: any, key: string, initialValue: MaybeRef<boolean>, options?: StorageOptions<boolean>): RemovableRef<boolean>
export function useStorage(uni: any, key: string, initialValue: MaybeRef<number>, options?: StorageOptions<number>): RemovableRef<number>
export function useStorage<T>(uni: any, key: string, initialValue: MaybeRef<T>, options?: StorageOptions<T>): RemovableRef<T>
export function useStorage<T = unknown>(uni: any, key: string, initialValue: MaybeRef<null>, options?: StorageOptions<T>): RemovableRef<T>

/**
 * Reactive Storage For Uniapp.
 *
 * @see https://vueuse.org/uniapp/useStorage/
 * @param key
 * @param initialValue
 * @param options
 */
export function useStorage<T extends(string | number | boolean | object | null)>(
  uni: any,
  key: string,
  initialValue: MaybeRef<T>,
  options: StorageOptions<T> = {},
): RemovableRef<any> {
  const storage = {
    getItem(key: string) {
      const v = uni.getStorageSync(key)
      // unlike the dom api, if the data does not exist in Storage, uni.getStorageSync will return the empty string
      return v === '' ? null : v
    },
    setItem(key: string, value: any) {
      uni.setStorageSync(key, value)
    },
    removeItem(key: string) {
      uni.removeStorageSync(key)
    },
  }
  return useStorageBase(key, initialValue, storage, options)
}
