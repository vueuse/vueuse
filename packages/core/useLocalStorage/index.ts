import { useStorage } from '../useStorage'
import { Ref } from '../../api'

export function useLocalStorage (key: string, defaultValue: string, storage?: Storage): Ref<string>
export function useLocalStorage (key: string, defaultValue: boolean, storage?: Storage): Ref<boolean>
export function useLocalStorage (key: string, defaultValue: number, storage?: Storage): Ref<number>
export function useLocalStorage<T extends object> (key: string, defaultValue: T, storage?: Storage): Ref<T>
export function useLocalStorage<T extends null> (key: string, defaultValue: null, storage?: Storage): Ref<any>
export function useLocalStorage<T extends(string|number|boolean|object|null)> (key: string, defaultValue: T): Ref<any> {
  // @ts-ignore
  return useStorage(key, defaultValue, localStorage)
}
