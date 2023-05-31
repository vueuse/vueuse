import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/shared'
import type { UseStorageOptions } from '../useStorage'
import { useStorage } from '../useStorage'
import { defaultWindow } from '../_configurable'

export function useSessionStorage(key: string, initialValue: MaybeRefOrGetter<string>, options?: UseStorageOptions<string>): RemovableRef<string>
export function useSessionStorage(key: string, initialValue: MaybeRefOrGetter<boolean>, options?: UseStorageOptions<boolean>): RemovableRef<boolean>
export function useSessionStorage(key: string, initialValue: MaybeRefOrGetter<number>, options?: UseStorageOptions<number>): RemovableRef<number>
export function useSessionStorage<T>(key: string, initialValue: MaybeRefOrGetter<T>, options?: UseStorageOptions<T>): RemovableRef<T>
export function useSessionStorage<T = unknown>(key: string, initialValue: MaybeRefOrGetter<null>, options?: UseStorageOptions<T>): RemovableRef<T>

/**
 * Reactive SessionStorage.
 *
 * @see https://vueuse.org/useSessionStorage
 * @param key
 * @param initialValue
 * @param options
 */
export function useSessionStorage<T extends(string | number | boolean | object | null)>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<any> {
  const { window = defaultWindow } = options
  return useStorage(key, initialValue, window?.sessionStorage, options)
}
