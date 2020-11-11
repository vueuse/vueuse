import { useStorage } from '../useStorage'
import { Ref } from 'vue-demi'

export function useSessionStorage (key: string, defaultValue: string): Ref<string>
export function useSessionStorage (key: string, defaultValue: boolean): Ref<boolean>
export function useSessionStorage(key: string, defaultValue: number): Ref<number>
export function useSessionStorage<T> (key: string, defaultValue: T): Ref<T>
export function useSessionStorage<T = unknown> (key: string, defaultValue: null): Ref<T>
export function useSessionStorage<T extends(string|number|boolean|object|null)> (key: string, defaultValue: T): Ref<any> {
  // @ts-ignore
  return useStorage(key, defaultValue, sessionStorage)
}
