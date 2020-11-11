import { useStorage } from '../useStorage'
import { Ref } from 'vue-demi'

export function useLocalStorage (key: string, defaultValue: string): Ref<string>
export function useLocalStorage (key: string, defaultValue: boolean): Ref<boolean>
export function useLocalStorage(key: string, defaultValue: number): Ref<number>
export function useLocalStorage<T> (key: string, defaultValue: T): Ref<T>
export function useLocalStorage<T = unknown> (key: string, defaultValue: null): Ref<T>
export function useLocalStorage<T extends(string|number|boolean|object|null)> (key: string, defaultValue: T): Ref<any> {
  // @ts-ignore
  return useStorage(key, defaultValue, localStorage)
}
