import { useStorage } from '../useStorage'
import { Ref } from '../../api'

export function useSessionStorage (key: string, defaultValue: string, storage?: Storage): Ref<string>
export function useSessionStorage (key: string, defaultValue: boolean, storage?: Storage): Ref<boolean>
export function useSessionStorage (key: string, defaultValue: number, storage?: Storage): Ref<number>
export function useSessionStorage<T extends object> (key: string, defaultValue: T, storage?: Storage): Ref<T>
export function useSessionStorage<T extends null> (key: string, defaultValue: null, storage?: Storage): Ref<any>
export function useSessionStorage<T extends(string|number|boolean|object|null)> (key: string, defaultValue: T): Ref<any> {
  // @ts-ignore
  return useStorage(key, defaultValue, sessionStorage)
}
